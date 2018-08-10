using Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.CostSystem
{
    public class BuyInquiry : EntityBase
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
        /// 货物名称
        /// </summary>
        public virtual string GoodsName { get; set; }
        /// <summary>
        /// 类型
        /// </summary>
        public virtual string Type { get; set; }
        /// <summary>
        /// 规格型号
        /// </summary>
        public virtual string SpecifiModel { get; set; }
        /// <summary>
        /// 货物描述
        /// </summary>
        public virtual string GoodsDescrip { get; set; }
        /// <summary>
        /// 货物编码
        /// </summary>
        public virtual string GoodsCode { get; set; }
        /// <summary>
        /// 采购量
        /// </summary>
        public virtual int BuyNumber { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public virtual int STATE { get; set; }
        /// <summary>
        /// 单位
        /// </summary>
        public virtual string Uints { get; set; }
        /// <summary>
        /// 商务要求
        /// </summary>
        public virtual string CommerceAsk { get; set; }
        /// <summary>
        /// 报价状态
        /// </summary>
        public virtual int BuyState { get; set; }
        /// <summary>
        /// 项目地址
        /// </summary>
        public virtual string ProjectAddress { get; set; }
        /// <summary>
        /// 附件
        /// </summary>
        public virtual string Enclosure { get; set; }
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
        /// 订单完成时间
        /// </summary>
        public virtual Nullable<DateTime> OrderTime { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public virtual DateTime CREATETIME { get; set; }
        #endregion

        #region 关系
        /// <summary>
        /// 项目主表和用户表UserInfo表 many to many
        /// </summary>
        private ISet<Base_UserInfo> _Users = null;
        public virtual ISet<Base_UserInfo> Users
        {
            get
            {
                if (null == this._Users)
                {
                    this._Users = new HashSet<Base_UserInfo>();
                }
                return this._Users;
            }
            set
            {
                this._Users = value;
            }
        }
        #endregion
    }
    public class BuyInquiryMap : EntityBaseMap<BuyInquiry>
    {
        public BuyInquiryMap()
        {
            #region 属性映射
            Table("BuyInquiry");
            Map(x => x.InquiryTitle);
            Map(x => x.BuyCompanyName);
            Map(x => x.GoodsName);
            Map(x => x.Type);
            Map(x => x.SpecifiModel);
            Map(x => x.GoodsDescrip);
            Map(x => x.GoodsCode);
            Map(x => x.BuyNumber);
            Map(x => x.Uints);
            Map(x => x.STATE);
            Map(x => x.CommerceAsk);
            Map(x => x.BuyState);
            Map(x => x.ProjectAddress);
            Map(x => x.Enclosure);
            Map(x => x.StartTime);
            Map(x => x.EndTime);
            Map(x => x.OrderTime);
            Map(x => x.BeiYong);
            Map(x => x.CREATETIME).ReadOnly();
            #endregion

            #region 关系映射
            //采购表和用户表UserInfo表 many to many
            HasManyToMany<Base_UserInfo>(o => o.Users)
                .AsSet()
                .ParentKeyColumn("BUYINQUIRYOID")
                .ChildKeyColumn("USERINFOOID")
                .Table("BuyInquiry_PERSON");
            #endregion
        }

    }
}
