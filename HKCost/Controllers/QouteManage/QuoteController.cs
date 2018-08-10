using Domain.CostSystem;
using Service.Interfaces.QuoteManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace HKCost.Controllers.QuoteManage
{
    /// <summary>
    /// 报价单控制器
    /// </summary>
    public class QuoteController:ApiController
    {
        #region 注入
        private readonly IQuoteBLL _quoteBll;
        #endregion
        /// <summary>
        /// 构造
        /// </summary>
        /// <param name="quoteBll"></param>
        public QuoteController(IQuoteBLL quoteBll)
        {
            _quoteBll = quoteBll;
        }

        /// <summary>
        /// 获取数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteList(int page,int limit,string swhere,string sort)
        {
            return _quoteBll.GetQuoteList(page, limit, swhere, sort);
        }

        /// <summary>
        /// 保存报价表信息
        /// </summary>
        /// <param name="supplierQuote"></param>
        /// <returns></returns>
        public bool PostQuoteSave(SupplierQuote supplierQuote)
        {
            return _quoteBll.PostQuoteSave(supplierQuote);
        }

        /// <summary>
        /// 通过采购商名称来获取此用户的询价记录
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        public object GetQuoteListswhere(string swhere)
        {
            return _quoteBll.GetQuoteListswhere(swhere);
        }
    }
}