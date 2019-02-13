using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using Common.CommonClass;
using Domain.Core;
using Domain.CostSystem;
using Newtonsoft.Json.Linq;
using Service.Interfaces.InquiryManage;

namespace HKCost.Controllers.InquiryManage
{
    /// <summary>
    /// 询价单控制器
    /// </summary>
    public class InquiryController : ApiController,IHttpHandler
    {
       
        #region 注入接口
        private readonly IInquiryBLL _inquiryBll;

        public bool IsReusable => throw new NotImplementedException();

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="inquiryBll"></param>
        public InquiryController(IInquiryBLL inquiryBll)
        {
            _inquiryBll = inquiryBll;
        }
        #endregion

        /// <summary>
        /// 上传word报价单文档（未使用）
        /// </summary>
        /// <param name="postClass"></param>
        /// <returns></returns>
        public object OffWordUpdate(PostClass postClass)
        {
            string name = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;

            bool res = false;
            dynamic dy = Common.NewtonJsonHelper.Deserialize<dynamic>(postClass.PostData.ToString(), null);//动态解析
            string _Title = dy.title;//获取当前记录标题
            
            string InquirySheet = "";//文件路径
            if (dy != null)
            {
                InquirySheet = Tools.FileHelper.ImgUpload(dy.WordUrl, dy.dataUrl, dy.dataName);//通过方法保存并返回路径
                BuyInquiry Inquiry = _inquiryBll.FindBy(t => t.InquiryTitle == _Title).ToList<BuyInquiry>().FirstOrDefault();//获取当条记录
                if (Inquiry != null)
                {
                    Inquiry.InquiryWord = InquirySheet;//更改路径
                    res = _inquiryBll.SaveOrUpdate(Inquiry);
                }
            }
            return res;
        }
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public string PostFiles()
        {
            string name = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            string result = "";
            HttpFileCollection filelist = HttpContext.Current.Request.Files;//通过http获取文件
            HttpContext.Current.Response.ContentType = "application/json";
            var paras = HttpContext.Current.Request.Params["data"];
            if (paras!=null)
            {
                JObject jobj = JObject.Parse(paras);
                string Title = jobj["username"].ToString();
            }
            bool res = false;
            if (filelist != null && filelist.Count > 0)
            {
                    HttpPostedFile file = filelist[0];//获取文件信息
                    string WordPath = file.FileName.Substring(file.FileName.LastIndexOf(".") + 1, (file.FileName.Length - file.FileName.LastIndexOf(".") - 1));//后缀名
                    string FileName = "/Upload/";
                    string filename = name + "_报价单."+WordPath;//文件路径
                    string FileNames = FileName + filename;//文件全路径（等待插入数据库）

                    //BuyInquiry buyInquiry = _inquiryBll.FindBy(x => x.InquiryTitle == Title).ToList<BuyInquiry>().FirstOrDefault();
                    //if (buyInquiry != null)
                    //{
                    //    buyInquiry.InquiryWord = FileName;
                    //      res = _inquiryBll.SaveOrUpdate(buyInquiry);
                    //}
                    //string filename = file.FileName;
                    //string FileName = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                    string FilePath = HttpContext.Current.Server.MapPath("~/")+ FileName;//项目目录
                string FilePaths = HttpContext.Current.Server.MapPath("~/")+ FileNames;//项目目录
                    //string FilePath = "/Upload" + "\\";
                    DirectoryInfo di = new DirectoryInfo(FilePath);//如果没有则创建目录
                    if (!di.Exists) { di.Create(); }
                    try
                    {
                        file.SaveAs(FilePaths);//保存文件
                        result = (FileName).Replace("\\", "/");//返回路径
                    }
                    catch (Exception ex)
                    {
                        result = "上传文件写入失败：" + ex.Message;
                    }
                
            }
            else
            {
                result = "上传的文件信息不存在！";
            }
            return result;
        }

        /// <summary>
        /// 获取询价表中的数据
        /// </summary>
        /// <param name="page">页数</param>
        /// <param name="limit">每页显示的条数</param>
        /// <param name="swhere">搜索条件</param>
        /// <param name="sort">排序条件</param>
        /// <returns></returns>
        public object GetInquiryList(int page, int limit, string swhere, string sort)
        {
            return _inquiryBll.GetInquiryList(page, limit, swhere, sort);
        }
        /// <summary>
        /// 假删除
        /// </summary>
        /// <param name="postClass"></param>
        /// <returns></returns>
        [HttpPost]
        public bool PostInquiryDelete(PostClass postClass)
        {
            return _inquiryBll.PostInquiryDelete(postClass.PostData);
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="buyInquiry"></param>
        /// <returns></returns>
        public bool PostInquirySave(BuyInquiry buyInquiry)
        {
            return _inquiryBll.PostInquirySave(buyInquiry);
        }

        public void ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }
    }
}
