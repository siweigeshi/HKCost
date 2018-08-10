using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace WebFrame.Areas.ExtFrame.resources.PlUpload
{
    /// <summary>
    /// UploadFile 的摘要说明
    /// </summary>
    public class UploadFile : IHttpHandler
    {

        string tempName = "_temp";
        public void ProcessRequest(HttpContext context)
        {
            string fileDirectory = HttpContext.Current.Server.MapPath("~/") + @"Upload";

            if (context.Request["path"] != null)
                fileDirectory = HttpContext.Current.Server.MapPath("~/") + context.Request["path"];

            string fileName = context.Request["name"];
            string tempFileName = fileName + tempName;

            int chunk = int.Parse(context.Request["chunk"]);
            int chunks = int.Parse(context.Request["chunks"]);
            System.IO.Stream stream = context.Request.Files[0].InputStream;
            int i = context.Request.Files.Count;
            byte[] buffer = new byte[stream.Length];
            stream.Read(buffer, 0, buffer.Length);

            if (chunk == 0)  //第一块
            {
                if (!Directory.Exists(fileDirectory))
                    Directory.CreateDirectory(fileDirectory);
            }

            FileStream fs = File.Open(fileDirectory + @"\" + tempFileName, FileMode.Append);
            fs.Write(buffer, 0, buffer.Length);
            fs.Close();

            if (chunk == chunks - 1)  //最后一块
            {
                string newfileDirectory = fileDirectory;
                if (context.Request["createDateDir"] != null && context.Request["createDateDir"].ToString() == "true")
                    newfileDirectory += @"\" + DateTime.Now.ToString("yyyyMMdd");
                if (!Directory.Exists(newfileDirectory))
                    Directory.CreateDirectory(newfileDirectory);
                if (File.Exists(newfileDirectory + @"\" + fileName))
                    File.Delete(newfileDirectory + @"\" + fileName);
                File.Move(fileDirectory + @"\" + tempFileName, newfileDirectory + @"\" + fileName);
                context.Response.Write((newfileDirectory + @"\" + fileName).Substring(HttpContext.Current.Server.MapPath("~/").Length));
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