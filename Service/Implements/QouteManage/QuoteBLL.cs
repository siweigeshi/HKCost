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
using Common;
using System.Data.SqlClient;

namespace Service.Implements.QuoteManage
{
    public class QuoteBLL : BaseBLL<SupplierQuote>, IQuoteBLL
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
                Sort = sort,
                ObjName = "QuoteList",
                Igorelist = new List<string>()
            };
            QueryParameter query = new QueryParameter("SupplierQuote", pagePara.Swhere, pagePara, null);
            return this.GetAllPageList(query);
        }
        /// <summary>
        /// 获取报价表报价成功的数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetQuoteResultList(int page, int limit, string swhere, string sort)
        {
            string user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            List<String> IDs = SessionFactory.GetCurrentSession().QueryOver<SupplierQuote>().Where(o => o.QuotationCompany == user && o.STATE == 0).Select(t => t.InquiryTitle).List<string>().ToList();//获取我参与过的项目的名称
            StringBuilder where = new StringBuilder();//拼接查询条件（项目名称格式化）
            foreach (var ID in IDs)
            {
                where.Append("'" + ID + "',");
            }
            string ere = where.ToString().TrimEnd(',');//得到字符串并去掉最后的逗号
            string temp = "1";
            string temp1 = "1";
            try
            {
                if (swhere != null)
                {
                    int s = swhere.IndexOf("|");
                    int a = swhere.LastIndexOf("|");
                    temp = swhere.Substring(0, s);
                    temp1 = swhere.Substring(a + 1, swhere.Length - a - 1);
                }
            }
            catch (Exception ee)
            {
                return "查询抛出异常" + ee;
            }
            try
            {
                List<SupplierQuote> upLoadList = Tools.ExecSqlHelp.ExecuteSql<SupplierQuote>("SELECT * FROM " +
                      //"SupplierQuote WHERE quotestate=2 and InquiryTitle in (lists)", new List<SqlParameter>(){
                      //     new SqlParameter(){ParameterName="lists",Value=ere}
                      "SupplierQuote WHERE quotestate=2 and " + temp + " like '%" + temp1 + "%' and state=0 and InquiryTitle in (" + ere + ")", null);//拼接SQL进行查询
                return Common.NewtonJsonHelper.Deserialize<object>("{\"curPage\":" + page + ",\"success\":true,\"total\":" + upLoadList.Count + ",\"QuoteResultList\":" + NewtonJsonHelper.Serialize(upLoadList, null) + "}", null);//构造返回数据
            }
            catch (Exception ee)
            {
                return "查询抛出异常" + ee;
            }
#if debug  
            //try
            //{
            //    string userName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;//获取当前用户
            //    StringBuilder where = new StringBuilder();
            //    //swhere = swhere != null ? swhere.TrimStart(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            //    //where.Append(swhere);


            //    where.Append(",InquiryTitle|string|");
            //    foreach (var ID in IDs)
            //    {
            //        where.Append("'" + ID + "',");
            //    }
            //    string ere = where.ToString().TrimEnd(',') + "|in";
            //    swhere = string.IsNullOrEmpty(swhere) ? ere : ere + "," + swhere;

            //    ////where.Append(",InquiryTitle in (@");
            //    //where.Append("InquiryTitle in (@");
            //    ////foreach (var ID in IDs)
            //    ////{
            //    ////    where.Append("'" + ID + "',");
            //    ////}
            //    //for (int i = 0; i < IDs.Count; i++)
            //    //{
            //    //    where.Append("'" + IDs[i] + "',");
            //    //}
            //    //string here = where.ToString().TrimEnd(',') + "@)";
            //    //swhere = string.IsNullOrEmpty(swhere) ? here : here + "," + swhere;
            //    ////where.Append("@)");
            //    ////where.AppendFormat(",InquiryTitle in (@{0}@)" , IDs);
            //    ////where.AppendFormat(",InquiryTitle|string|{0}|" + +"in" + ss);
            //    PageParameter pagePara = new PageParameter()
            //    {
            //        PageIndex = page,
            //        Limit = limit,
            //        //Swhere = where.ToString(),a
            //        Swhere = swhere,
            //        Sort = sort,
            //        ObjName = "QuoteResultList",
            //        Igorelist = new List<string>() { "Inquiries" }
            //    };
            //    QueryParameter query = new QueryParameter("SupplierQuote", pagePara.Swhere, pagePara, null);
            //    return this.GetAllPageList(query);
            //}
            //catch (Exception ee)
            //{

            //    return null;
            //}
            /***/
#endif
        }
        /// <summary>
        /// 通过采购商名称来获取此用户的询价记录
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        public object GetQuoteListswhere(string swhere)
        {
            string user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            IList<SupplierQuote> List = SessionFactory.GetCurrentSession().QueryOver<SupplierQuote>().Where(x => x.QuotationCompany == user && x.InquiryTitle == swhere && x.STATE == 0).List<SupplierQuote>().ToList();
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
