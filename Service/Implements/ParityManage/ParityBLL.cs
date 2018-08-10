using BLL.Interfaces.IBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.CostSystem;
using Service.Interfaces.ParityManage;
using BLL.Implements.Base;
using DAL.Implements.Base;
using Domain.Study;
using Domain.Core;
using Common.QueryHelper;

namespace Service.Implements.ParityManage
{
    public class ParityBLL : BaseBLL<SupplierQuote>, IParityBLL 
    {
    
        public ParityBLL(UnitOfWork uow) : base(uow)
        {
        }

        /// <summary>
        /// 获取报价表数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteList(int page, int limit, string swhere, string sort)
        {
            string name = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            StringBuilder where = new StringBuilder();
            swhere = swhere != null ? swhere.TrimEnd(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            where.Append(swhere);
            where.AppendFormat(",BuyCompanyName|{0}|" + name + "|,QuoteState|1|1|", name);
            PageParameter pageParm = new PageParameter()
            {
                PageIndex = page,
                Limit = limit,
                Swhere = where.ToString(),
                Sort = sort,
                ObjName = "QuoteSheetList",
                Igorelist = new List<string>()
            };
            QueryParameter query = new QueryParameter("SupplierQuote", pageParm.Swhere, pageParm, null);
            return this.GetAllPageList(query);
        }

       
        /// <summary>
        /// 修改报价表状态
        /// </summary>
        /// <param name="supplierQuote"></param>
        /// <returns></returns>
        public bool PostQuoteStatusSave(SupplierQuote supplierQuote)
        {
            return this.SaveOrUpdate(supplierQuote);
        }
    }
}
