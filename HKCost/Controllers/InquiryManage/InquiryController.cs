using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Common.CommonClass;
using Domain.CostSystem;
using Service.Interfaces.InquiryManage;

namespace HKCost.Controllers.InquiryManage
{
    /// <summary>
    /// 询价单控制器
    /// </summary>
    public class InquiryController : ApiController
    {
        #region 注入接口
        private readonly IInquiryBLL _inquiryBll;
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
    }
}
