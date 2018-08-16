using BLL.Implements.Base;
using Common.QueryHelper;
using DAL.Implements.Base;
using Domain.Core;
using Domain.CostSystem;
using Service.Interfaces.ParityManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Implements.ParityManage
{
    public class DealOrderBLL : BaseBLL<DealOrder>, IDealOrderBLL
    {
        public DealOrderBLL(UnitOfWork uow) : base(uow)
        {
        }
        /// <summary>
        /// 获取交易单数据（条件是采购人是自己）
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetDealOrderList(int page, int limit, string swhere, string sort)
        {
            string username = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            StringBuilder where = new StringBuilder();
            //swhere = swhere != null ? "STATE|int|0|=" : "STATE|int|0|=";
            swhere = swhere != null ? swhere.TrimEnd(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            where.Append(swhere);
            where.AppendFormat(",BuyCompanyName|{0}|" + username + "|", username);
            PageParameter pageParm = new PageParameter()
            {
                PageIndex = page,
                Limit = limit,
                Swhere = where.ToString(),
                Sort = sort,
                ObjName = "DealOrderList",
                Igorelist = new List<string>() { "Users"}
            };
            QueryParameter query = new QueryParameter("DealOrder", pageParm.Swhere, pageParm, null);
            return GetAllPageList(query);
        }

        /// <summary>
        /// 保存交易订单
        /// </summary>
        /// <param name="dealOrder"></param>
        /// <returns></returns>
        public bool PostDealOrderSave(DealOrder dealOrder)
        {
            if (string.IsNullOrEmpty(dealOrder.OID))
            {
                dealOrder.BuyCompanyName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            }
            return this.SaveOrUpdate(dealOrder);
        }
    }
}
