using Domain.CostSystem;
using Service.Interfaces.ParityManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HKCost.Controllers.ParityManage
{
    /// <summary>
    /// 比价单控制器
    /// </summary>
    public class ParityController : ApiController
    {
        private readonly IParityBLL _parityBLL;
        /// <summary>
        /// 构造
        /// </summary>
        /// <param name="parityBLL"></param>
        public ParityController(IParityBLL parityBLL)
        {
            _parityBLL = parityBLL;
        }
        /// <summary>
        /// 获取报价表数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteList(int page,int limit,string swhere,string sort)
        {
            return _parityBLL.GetQuoteList(page, limit, swhere, sort);
        }

        /// <summary>
        /// 修改报价单信息
        /// </summary>
        /// <param name="supplierQuote"></param>
        /// <returns></returns>
        public bool PostQuoteStatusSave(SupplierQuote supplierQuote)
        {
            return _parityBLL.PostQuoteStatusSave(supplierQuote);
        }
    }
}
