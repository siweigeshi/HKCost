using Common.CommonClass;
using Service.Interfaces.QuoteManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HKCost.Controllers.QouteManage
{
       /// <summary>
       /// 报价单管理控制器
       /// </summary>
    public class QuoteManageController : ApiController
    {
        private readonly IQuoteManageBLL _quoteManageBLL;
        /// <summary>
        /// 构造
        /// </summary>
        /// <param name="quoteManageBLL"></param>
        public QuoteManageController(IQuoteManageBLL quoteManageBLL)
        {
            _quoteManageBLL = quoteManageBLL;
        }
        /// <summary>
        /// 获取报价表管理中的数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteManageList(int page, int limit, string swhere, string sort)
        {
           return _quoteManageBLL.GetQuoteManageList(page, limit, swhere, sort);
        }

        /// <summary>
        /// 通过标题来寻找当前询价单
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        public object GetQuoteManageListswhere(string swhere)
        {
            return _quoteManageBLL.GetQuoteManageListswhere(swhere);
        }
        /// <summary>
        /// 假删除
        /// </summary>
        /// <param name="postClass"></param>
        /// <returns></returns>
        [HttpPost]
        public bool PostQuoteDelete(PostClass postClass)
        {
            return _quoteManageBLL.PostQuoteDelete(postClass.PostData);
        }
    }
}
