using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.CostSystem
{
    public class DealOrder:EntityBase
    {
        #region 属性
        /// <summary>
        /// 询价标题
        /// </summary>
        public virtual string InquiryTitle { get; set; }
        /// <summary>
        /// 采购公司名称
        /// </summary>
        public virtual string BuyCompanyName { get; set; }
        /// <summary>
        /// 报价公司
        /// </summary>
        public virtual string QuotationCompany { get; set; }
        /// <summary>
        /// 采购金额
        /// </summary>
        public virtual float QuotedPrice { get; set; }
        /// <summary>
        /// 货物名称
        /// </summary>
        public virtual string GoodsName { get; set; }
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
        /// 备用
        /// </summary>
        public virtual string BeiYong { get; set; }
        /// <summary>
        /// 开始时间
        /// </summary>
        public virtual Nullable<DateTime> StartTime { get; set; }
        /// <summary>
        /// 结束时间
        /// </summary>
        public virtual Nullable<DateTime> EndTime { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public virtual DateTime CREATETIME { get; set; }
        #endregion

        #region 关系
        #endregion
    }
    public class DealOrderMap:EntityBaseMap<DealOrder>
    {
        public DealOrderMap()
        {
            #region 属性映射
            Table("DealOrder");
            Map(x => x.InquiryTitle);
            Map(x => x.BuyCompanyName);
            Map(x => x.QuotationCompany);
            Map(x => x.QuotedPrice);
            Map(x => x.GoodsName);
            Map(x => x.Contacts);
            Map(x => x.Tel);
            Map(x => x.STATE);
            Map(x => x.StartTime);
            Map(x => x.EndTime);
            Map(x => x.BeiYong);
            Map(x => x.CREATETIME).ReadOnly();
            #endregion

            #region 关系映射
           
            #endregion
        }

    }
}
