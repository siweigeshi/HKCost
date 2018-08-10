using BLL.Implements.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.CostSystem;
using Service.Interfaces.QuoteManage;
using DAL.Implements.Base;
using Domain.Core;
using Common.QueryHelper;
using DAL;

namespace Service.Implements.QuoteManage
{
   public class QuoteBLL:BaseBLL<SupplierQuote>, IQuoteBLL
    {
        #region 构造
        public QuoteBLL(UnitOfWork _uow) : base(_uow) { }//构造子类需要调用父类的构造函数，通过:base 可以调用带有参数的指定的构造函数
        #endregion

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
            string userName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;//获取当前用户
            StringBuilder where = new StringBuilder();
            swhere = swhere != null ? swhere.TrimStart(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            where.Append(swhere);
            PageParameter pagePara = new PageParameter()
            {
                PageIndex = page,
                Limit = limit,
                Swhere = where.ToString(),
                Sort=sort,
                ObjName= "QuoteList",
                Igorelist=new List<string>()
            };
            QueryParameter query = new QueryParameter("SupplierQuote", pagePara.Swhere, pagePara, null);
            return this.GetAllPageList(query);
        }
        /// <summary>
        /// 通过采购商名称来获取此用户的询价记录
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        public object GetQuoteListswhere(string swhere)
        {
            string user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            IList<SupplierQuote> List = SessionFactory.GetCurrentSession().QueryOver<SupplierQuote>().Where(x => x.QuotationCompany == user && x.InquiryTitle==swhere&& x.STATE==0).List<SupplierQuote>().ToList();
            return Common.NewtonJsonHelper.Deserialize<object>
                 (Common.NewtonJsonHelper.Serialize(List, null), null);
        }
        /// <summary>
        /// 保存询价表数据
        /// </summary>
        /// <param name="supplierQuote"></param>
        /// <returns></returns>
        public bool PostQuoteSave(SupplierQuote supplierQuote)
        {
            if (string.IsNullOrEmpty(supplierQuote.OID))
            {
                supplierQuote.QuotationCompany = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            }
            return this.SaveOrUpdate(supplierQuote);
        }
    }
}
