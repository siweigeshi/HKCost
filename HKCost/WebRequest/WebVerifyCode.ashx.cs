using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Web;

namespace HKCost.WebRequest
{
    /// <summary>
    /// VerifyCode 的摘要说明
    /// </summary>
    public class WebVerifyCode : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            var codeNum = 4;

            int ranNum;
            char[] cArray = new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
            string checkCode = string.Empty;
            Random random2 = new Random();
            for (int i = 0; i < codeNum; i++)
            {
                ranNum = random2.Next(26);
                checkCode += cArray[ranNum];
            }
            context.Response.Cookies.Add(new HttpCookie("WebCheckCode", checkCode));

            if (checkCode == null || checkCode.Trim() == string.Empty)
                return;
            Bitmap image = new Bitmap((int)Math.Ceiling(checkCode.Length * 13.5), 29);
            Graphics g = Graphics.FromImage(image);
            try
            {
                Random random = new Random();
                g.Clear(Color.White);
                //画背景干扰线
                for (int i = 0; i < 2; i++)
                {
                    int x1 = random.Next(image.Width);
                    int x2 = random.Next(image.Width);
                    int y1 = random.Next(image.Height);
                    int y2 = random.Next(image.Height);
                    g.DrawLine(new Pen(Color.OrangeRed), x1, y1, x2, y2);
                }
                Font font = new Font("Segoe Print", 13, (FontStyle.Bold));
                LinearGradientBrush brush = new LinearGradientBrush(new Rectangle(0, 0, image.Width, image.Height), Color.DarkGreen, Color.DarkOrchid, 1.2f, true);

                g.DrawString(checkCode, font, brush, 2, 2);

                //画图片前景噪音点
                for (int i = 0; i < 30; i++)
                {
                    int x = random.Next(image.Width);
                    int y = random.Next(image.Height);
                    image.SetPixel(x, y, Color.FromArgb(random.Next()));
                }

                //画图片边框线
                g.DrawRectangle(new Pen(Color.Silver), 0, 0, image.Width - 1, image.Height - 1);
                System.IO.MemoryStream ms = new System.IO.MemoryStream();
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
                context.Response.ClearContent();
                context.Response.ContentType = "image/Gif";
                context.Response.BinaryWrite(ms.ToArray());
            }
            finally
            {
                g.Dispose();
                image.Dispose();
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