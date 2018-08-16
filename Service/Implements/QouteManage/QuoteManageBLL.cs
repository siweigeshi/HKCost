using BLL.Implements.Base;
using Common.CommonClass;
using Common.QueryHelper;
using DAL;
using DAL.Implements.Base;
using Domain.Core;
using Domain.CostSystem;
using NHibernate.Engine;
using Service.Interfaces.QuoteManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Implements.QouteManage
{

    public class QuoteManageBLL : BaseBLL<SupplierQuote>, IQuoteManageBLL
    {
        /// <summary>
        /// 构造
        /// </summary>
        /// <param name="uow"></param>
        public QuoteManageBLL(UnitOfWork uow) : base(uow)
        {
        }

        /// <summary>
        /// 获取报价表分页数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteManageList(int page, int limit, string swhere, string sort)
        {
            string userName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            StringBuilder where = new StringBuilder();
            swhere = swhere != null ? swhere.TrimEnd(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            where.Append(swhere);
            where.AppendFormat(",QuotationCompany|{0}|" + userName + "|", userName);
            //where.AppendFormat(",(@QuotationCompany|{0}|" + userName + "|@", userName);
            PageParameter pageParm = new PageParameter()
            {
                PageIndex = page,
                Limit = limit,
                Swhere = where.ToString(),
                Sort = sort,
                ObjName = "QuoteManageList",
                Igorelist = new List<string>()
            };
            QueryParameter query = new QueryParameter("SupplierQuote", pageParm.Swhere, pageParm, null);
            return this.GetAllPageList(query);
        }
        /// <summary>
        /// 通过报价标题找到该询价单信息
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        public object GetQuoteManageListswhere(string swhere)
        {
            IList<BuyInquiry> list = SessionFactory.GetCurrentSession().QueryOver<BuyInquiry>().Where(x => x.InquiryTitle == swhere  && x.STATE==0).List<BuyInquiry>().ToList();
            return Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(list, null), null);
        }
        /// <summary>
        /// 假删除
        /// </summary>
        /// <param name="OIDs"></param>
        /// <returns></returns>
        public bool PostQuoteDelete(string OIDs)
        {
            return this.LogicDelete(OIDs)>0;
        }

    }
}
