using BLL.Implements.Base;
using Common.CommonClass;
using Common.QueryHelper;
using DAL.Implements.Base;
using Domain.Core;
using Domain.CostSystem;
using Service.Interfaces.InquiryManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Implements.InquiryManage
{
    public class InquiryBLL : BaseBLL<BuyInquiry>, IInquiryBLL
    {
        #region  构造函数
        public InquiryBLL(UnitOfWork _uow) : base(_uow) { }
        #endregion

       
        /// <summary>
        /// 获取询价单数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetInquiryList(int page, int limit, string swhere, string sort)
        {
            int isActives = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).IsActive;//获取用户名称
            if (isActives==0)
            {
                return Common.NewtonJsonHelper.Deserialize<object>("{\"curPage\":" + page + ",\"success\":true,\"total\":" + 0 + ",\"QuoteResultList\":[]}", null);//构造返回数据
            }
            else
            {
                StringBuilder where = new StringBuilder();
                swhere = swhere != null ? swhere.TrimEnd(',') + ",STATE|int|0|=" : "STATE|int|0|=";//构建查询语句
                where.Append(swhere);
                //where.AppendFormat(",(@BuyCompanyName|{0}|"+userName,userName);
                PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = where.ToString(), Sort = sort, ObjName = "inquiryList", Igorelist = new List<string>() };
                QueryParameter query = new QueryParameter("BuyInquiry", pagePara.Swhere, pagePara, null);
                return this.GetAllPageList(query);
            }
        }
        /// <summary>
        /// 假删除
        /// </summary>
        /// <param name="OIDs"></param>
        /// <returns></returns>
        public bool PostInquiryDelete(string OIDs)
        {
            return this.LogicDelete(OIDs) > 0;
        }
        /// <summary>
        /// 增加采购单信息
        /// </summary>
        /// <param name="buyInquiry"></param>
        /// <returns></returns>
        public bool PostInquirySave(BuyInquiry buyInquiry)
        {
            if (string.IsNullOrEmpty(buyInquiry.OID))
            {
                buyInquiry.BuyCompanyName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            }
            if (buyInquiry.BuyState == 2)
            {
                buyInquiry.OrderTime = DateTime.Now;
            }
            return this.SaveOrUpdate(buyInquiry);
        }
    }
}
