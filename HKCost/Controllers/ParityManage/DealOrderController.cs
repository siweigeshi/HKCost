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
    /// 交易单控制器
    /// </summary>
    public class DealOrderController : ApiController
    {
        private readonly IDealOrderBLL _dealOrderBLL;
        /// <summary>
        /// 构造
        /// </summary>
        /// <param name="dealOrderBLL"></param>
        public DealOrderController(IDealOrderBLL dealOrderBLL)
        {
            _dealOrderBLL = dealOrderBLL;
        }

        /// <summary>
        /// 获取交易单数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetDealOrderList(int page, int limit, string swhere, string sort)
        {
            return _dealOrderBLL.GetDealOrderList(page, limit, swhere, sort);
        }

        /// <summary>
        /// 保存交易单信息
        /// </summary>
        /// <param name="dealOrder"></param>
        /// <returns></returns>
        public bool PostDealOrderSave(DealOrder dealOrder)
        {
            return _dealOrderBLL.PostDealOrderSave(dealOrder);
        }
    }
}
