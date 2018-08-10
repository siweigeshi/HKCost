using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.CostSystem
{
    public class SupplierQuote:EntityBase
    {
        #region 属性
        /// <summary>
        /// 询价标题
        /// </summary>
        public virtual string InquiryTitle { get; set; }
        /// <summary>
        /// 报价公司
        /// </summary>
        public virtual string QuotationCompany { get; set; }
        /// <summary>
        /// 采购公司名称
        /// </summary>
        public virtual string BuyCompanyName { get; set; }
        /// <summary>
        /// 报价金额
        /// </summary>
        public virtual float QuotedPrice { get; set; }
        /// <summary>
        /// 品牌
        /// </summary>
        public virtual string Brand { get; set; }
        /// <summary>
        /// 货物描述和备注
        /// </summary>
        public virtual string Remarks { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        public virtual string Contacts { get; set; }
        /// <summary>
        /// 联系电话
        /// </summary>
        public virtual string Tel { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public virtual int STATE { get; set; }
        /// <summary>
        /// 报价状态
        /// </summary>
        public virtual int QuoteState { get; set; }
        /// <summary>
        /// 报价时间
        /// </summary>
        public virtual DateTime CREATETIME { get; set; }
        #endregion


        #region 关系
        /// <summary>
        /// 询价单和报价表之间多对多关系
        /// </summary>
        private ISet<BuyInquiry> _Inquiries = null;
        public virtual ISet<BuyInquiry> Inquiries
        {
            get
            {
                if (null==this._Inquiries)
                {
                    this._Inquiries = new HashSet<BuyInquiry>();
                }
                return this._Inquiries;
            }
            set
            {
               this._Inquiries = value;
            }
        }
        #endregion

    }
    public class SupplierQuoteMap:EntityBaseMap<SupplierQuote>
    {
        public SupplierQuoteMap()
        {
            #region 属性映射
            Table("SupplierQuote");
            Map(x => x.InquiryTitle);
            Map(x => x.QuotationCompany);
            Map(x => x.BuyCompanyName);
            Map(x => x.QuotedPrice);
            Map(x => x.Brand);
            Map(x => x.Remarks);
            Map(x => x.Contacts);
            Map(x => x.Tel);
            Map(x => x.STATE);
            Map(x => x.QuoteState);
            Map(x => x.CREATETIME).ReadOnly();
            #endregion
            
            #region 关系映射
            HasManyToMany<BuyInquiry>(o => o.Inquiries)
                .AsSet()
                .ParentKeyColumn("QuoteOID")
                .ChildKeyColumn("BuyInquiryOID")
                .Table("BuyInquiry_Quote");
            #endregion 
        }
    }
}
