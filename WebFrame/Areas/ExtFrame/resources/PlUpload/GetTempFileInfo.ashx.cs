using Common.CommonClass;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebFrame.Areas.ExtFrame.resources.PlUpload
{
    /// <summary>
    /// GetTempFileInfo 的摘要说明
    /// </summary>
    public class GetTempFileInfo : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string strResponse = "0";
            GetClass GetClass = new Common.CommonClass.GetClass();
            GetClass.GetData = context.Request["GetData"];
            dynamic getData = Common.NewtonJsonHelper.Deserialize<dynamic>(GetClass.GetData, null);
            string path = getData.path;
            string filePath = HttpContext.Current.Server.MapPath("~/" + path + "_temp");
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(filePath);
            if (fileInfo.Exists)
            {
                strResponse = fileInfo.Length.ToString();
            }
            context.Response.ContentType = "text/plain";
            context.Response.Write(strResponse);
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