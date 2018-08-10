using Common.CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebFrame.Areas.ExtFrame.resources.PlUpload
{
    /// <summary>
    /// DownloadFile 的摘要说明
    /// </summary>
    public class DownloadFile : IHttpHandler
    {
        int ChunkSize = 512 * 1024;//每次读取得大小
        public void ProcessRequest(HttpContext context)
        {
            GetClass GetClass = new Common.CommonClass.GetClass();
            GetClass.GetData = context.Request["GetData"];
            dynamic getData = Common.NewtonJsonHelper.Deserialize<dynamic>(GetClass.GetData, null);
            string name = getData.name;
            string path = getData.path;
            string filePath = HttpContext.Current.Server.MapPath("~/" + path);
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(filePath);
            if (fileInfo.Exists)
            {
                byte[] buffer = new byte[ChunkSize];
                context.Response.Clear();
                System.IO.FileStream iStream = System.IO.File.OpenRead(filePath);
                long dataLengthToRead = iStream.Length;//获得下载文件的总大小
                long offset = 0, count = dataLengthToRead;
                //处理按范围请求下载 开始字节-结束字节
                if (context.Request.Headers.AllKeys.Contains("Range"))
                {
                    var match = System.Text.RegularExpressions.Regex.Match(context.Request.Headers["Range"], @"(?<=bytes\b*=)(\d*)-(\d*)");
                    if (match.Success)
                    {
                        context.Response.StatusCode = (int)System.Net.HttpStatusCode.PartialContent;
                        string v1 = match.Groups[1].Value;
                        string v2 = match.Groups[2].Value;
                        if (!match.NextMatch().Success)
                        {
                            if (v1 == "" && v2 != "") //没有起始值，默认为0
                            {
                                var r2 = long.Parse(v2);
                                if (r2 <= count)
                                {
                                    offset = 0;
                                    count = r2;
                                    //响应的格式是:Content-Range: bytes [文件块的开始字节]-[文件的总大小 - 1]/[文件的总大小]
                                    context.Response.AddHeader("Content-Range", "bytes " + offset.ToString() + "-" + ((long)(dataLengthToRead - 1)).ToString() + "/" + dataLengthToRead.ToString());
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.PartialContent;
                                }
                                else  //结束位置超界,返回零值
                                {
                                    offset = 0;
                                    count = 0;
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.RequestedRangeNotSatisfiable;
                                }
                            }
                            else if (v1 != "" && v2 == "")
                            {
                                var r1 = long.Parse(v1);
                                if (r1 > count)//起始位置超界,返回零值
                                {
                                    offset = 0;
                                    count = 0;
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.RequestedRangeNotSatisfiable;
                                }
                                else
                                {
                                    offset = r1;
                                    count -= r1;
                                    //响应的格式是:Content-Range: bytes [文件块的开始字节]-[文件的总大小 - 1]/[文件的总大小]
                                    context.Response.AddHeader("Content-Range", "bytes " + offset.ToString() + "-" + ((long)(dataLengthToRead - 1)).ToString() + "/" + dataLengthToRead.ToString());
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.PartialContent;
                                }
                            }
                            else if (v1 != "" && v2 != "")
                            {
                                var r1 = long.Parse(v1);
                                var r2 = long.Parse(v2);
                                if (r1 < count && r2 < count && r2 > r1)
                                {
                                    offset = r1;
                                    count -= r2 - r1 + 1;
                                    //响应的格式是:Content-Range: bytes [文件块的开始字节]-[文件的总大小 - 1]/[文件的总大小]
                                    context.Response.AddHeader("Content-Range", "bytes " + offset.ToString() + "-" + ((long)(dataLengthToRead - 1)).ToString() + "/" + dataLengthToRead.ToString());
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.PartialContent; //必须有，范围下载
                                }
                                else  //范围出错,返回零值
                                {
                                    offset = 0;
                                    count = 0;
                                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.RequestedRangeNotSatisfiable;
                                }
                            }
                            else
                            {
                                context.Response.StatusCode = (int)System.Net.HttpStatusCode.OK;
                            }
                        }
                    }
                }

                iStream.Position = offset;  //流起始位置
                dataLengthToRead = count;   //需要读的字节数

                string[] fileNames = filePath.Split('\\');
                string fileName = name;//fileNames[fileNames.Length - 1];

                context.Response.ContentType = "application/octet-stream";
                //通知浏览器下载文件而不是打开，中文转化编码
                context.Response.AddHeader("Content-Disposition", "attachment;  filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
                context.Response.AppendHeader("Content-Length", dataLengthToRead.ToString()); //需要给出文件长度（需要都的字节数）（便于客户端使用，显示进度）


                while (dataLengthToRead > 0 && context.Response.IsClientConnected)
                {
                    int lengthRead = iStream.Read(buffer, 0, Convert.ToInt32(ChunkSize));//读取的大小
                    context.Response.OutputStream.Write(buffer, 0, lengthRead);
                    context.Response.Flush();
                    // context.Response.Clear(); 
                    dataLengthToRead = dataLengthToRead - lengthRead;
                }

                iStream.Close();
                context.Response.End();
                context.Response.Close();
            }
            else
            {
                HttpContext.Current.Response.Write("文件不存在");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}