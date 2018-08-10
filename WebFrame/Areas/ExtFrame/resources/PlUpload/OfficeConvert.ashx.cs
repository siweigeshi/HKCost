using Common.CommonClass;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Web;

namespace WebFrame.Areas.ExtFrame.resources.PlUpload
{
    /// <summary>
    /// OfficeConvert 的摘要说明
    /// </summary>
    public class OfficeConvert : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string strResponse = "false";
            PostClass PostClass = new Common.CommonClass.PostClass();
            PostClass.PostData = context.Request["PostData"];
            dynamic dynamic = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData, null);
            string filePath = HttpContext.Current.Server.MapPath("~/") + dynamic.filepath.ToString();
            string extendName = filePath.Split('.')[filePath.Split('.').Length - 1];
            string htmlPath = HttpContext.Current.Server.MapPath("~/") + dynamic.htmlpath.ToString();
            if (extendName == "doc" || extendName == "docx")
            {
                strResponse = WordToHtml(filePath, htmlPath) ? "true" : "false";
            }
            else if (extendName == "xls" || extendName == "xlsx")
            {
                strResponse = ExcelToHtml(filePath, htmlPath) ? "true" : "false";
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
        /// <summary>
        /// word转html
        /// </summary>
        /// <param name="wordFileName">word文档访问路径(服务器绝对路径)</param>
        /// <param name="htmlWord">html保存目录(服务器绝对路径)</param>
        /// <returns>true/false</returns>
        private bool WordToHtml(string wordFileName, string htmlWord)
        {
            bool isConvert = false;
            Microsoft.Office.Interop.Word.ApplicationClass word = new Microsoft.Office.Interop.Word.ApplicationClass();
            Type wordType = word.GetType();
            Microsoft.Office.Interop.Word.Documents docs = word.Documents;
            try
            {
                //打开文件
                Type docsType = docs.GetType();
                Microsoft.Office.Interop.Word.Document doc = (Microsoft.Office.Interop.Word.Document)docsType.InvokeMember("Open", System.Reflection.BindingFlags.InvokeMethod, null, docs, new Object[] { wordFileName, true, true });
                Type docType = doc.GetType();
                //转换格式，另存为
                string wordSaveFileName = wordFileName.ToString();
                string strSaveFileName = htmlWord + "\\" + Path.GetFileNameWithoutExtension(wordSaveFileName) + ".html";
                object saveFileName = (object)strSaveFileName;
                docType.InvokeMember("SaveAs", System.Reflection.BindingFlags.InvokeMethod, null, doc, new object[] { saveFileName, Microsoft.Office.Interop.Word.WdSaveFormat.wdFormatFilteredHTML });
                //关闭文件
                docType.InvokeMember("Close", System.Reflection.BindingFlags.InvokeMethod, null, doc, null);
                isConvert = true;
            }
            catch (Exception ex)
            {
                isConvert = false;
            }
            //退出Word
            wordType.InvokeMember("Quit", System.Reflection.BindingFlags.InvokeMethod, null, word, null);
            return isConvert;
        }
        /// <summary>
        /// excel转html
        /// </summary>
        /// <param name="xlsFilePath">excel文档访问路径(服务器绝对路径)</param>
        /// <param name="htmlXls">html保存目录(服务器绝对路径)</param>
        /// <returns>true/false</returns>
        [DllImport("User32.dll", CharSet = CharSet.Auto)]
        static extern uint GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);
        private bool ExcelToHtml(string xlsFilePath, string htmlXls)
        {
            bool isConvert = false;
            Microsoft.Office.Interop.Excel.Application repExcel = new Microsoft.Office.Interop.Excel.Application();
            Microsoft.Office.Interop.Excel.Workbook workbook = null;
            //xlsFile为Excel文件路径
            try
            {
                workbook = repExcel.Application.Workbooks.Open(xlsFilePath, Missing.Value,
                    Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value,
                    Missing.Value, Missing.Value, Missing.Value, Missing.Value, Missing.Value,
                    Missing.Value, Missing.Value, Missing.Value);
                object ofmt = Microsoft.Office.Interop.Excel.XlFileFormat.xlHtml;
                string strSaveFileName = htmlXls + "\\" + Path.GetFileNameWithoutExtension(xlsFilePath) + ".html";
                workbook.SaveAs(strSaveFileName, ofmt, Missing.Value, Missing.Value, Missing.Value, Missing.Value,
                    Microsoft.Office.Interop.Excel.XlSaveAsAccessMode.xlNoChange, Missing.Value, Missing.Value,
                    Missing.Value, Missing.Value, Missing.Value);
                isConvert = true;
            }
            catch (Exception ex)
            {
                isConvert = false;
            }
            object osave = false;
            if (workbook != null)
                workbook.Close(osave, Missing.Value, Missing.Value);
            repExcel.Quit();

            IntPtr t = new IntPtr(repExcel.Hwnd);
            int k = 0;
            GetWindowThreadProcessId(t, out k); //得到本进程唯一标志k
            System.Diagnostics.Process p = System.Diagnostics.Process.GetProcessById(k);
            p.Kill();//关闭进程k

            return isConvert;
        }
    }

}