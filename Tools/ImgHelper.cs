using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Tools
{
    public class ImgHelper
    {
        /// <summary>
        /// 上传图片并保存，返回图片路径
        /// </summary>
        /// <param name="base64">base64图片数据</param>
        /// <param name="url">图片保存路径(相对网站根目录路径)</param>
        /// <returns>图片路径（相对路径）</returns>
        public static string ImgUpload(string base64, string url,string name)
        {
            //图片相对路径,用来保存到数据库
            string imgUrl = string.Empty;

            string dataUrl = base64.Replace(" ", "+");
            //tmp[0]用来获取图片后缀名，tmp[1]是用来写入图片的base64图片数据
            string[] tmp = dataUrl.Split(',');
            byte[] bytes = Convert.FromBase64String(tmp[1]);
            //图片扩展名
            string temp = tmp[0].Substring(tmp[0].IndexOf('/') + 1);
            string fileExtend = temp.Substring(0, temp.IndexOf(';'));
            string dir = HttpContext.Current.Server.MapPath("~/") + url;
            //判断文件夹是否存在
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            } 
            //imgUrl = String.Format(url + "/{0}.{1}", Guid.NewGuid().ToString(), fileExtend);
            imgUrl = String.Format(url + "/{0}.{1}", name, fileExtend);
            //图片绝对路径，用来做写入文件参数
            string saveUrl = HttpContext.Current.Server.MapPath("~/") + imgUrl;
            MemoryStream stream = new MemoryStream(bytes);
            //写入文件
            StreamToFile(stream, saveUrl);
            return imgUrl;
        }
        /// <summary>
        /// 写入文件
        /// </summary>
        /// <param name="stream">文件流</param>
        /// <param name="saveUrl">文件保存位置</param>
        private static void StreamToFile(Stream stream, string saveUrl)
        {
            // 把 Stream 转换成 byte[] 
            byte[] bytes = new byte[stream.Length];
            stream.Read(bytes, 0, bytes.Length);
            // 设置当前流的位置为流的开始 
            stream.Seek(0, SeekOrigin.Begin);
            // 把 byte[] 写入文件 
            FileStream fs = new FileStream(saveUrl, FileMode.Create);
            BinaryWriter bw = new BinaryWriter(fs);
            bw.Write(bytes);
            bw.Close();
            fs.Close();
        }
    }
}
