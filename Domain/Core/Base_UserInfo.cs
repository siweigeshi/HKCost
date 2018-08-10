using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_UserInfo : EntityBase
    {
        #region 属性
        public virtual string Name { get; set; }
        public virtual string UserName { get; set; }
        public virtual string UserPwd { get; set; }
        public virtual DateTime CreateTime { get; set; }
        public virtual int State { get; set; }
        public virtual string EMAIL { get; set; }
        public virtual string VCODE { get; set; }
        public virtual Nullable<DateTime> VDATETIME { get; set; }
        /// <summary>
        /// 电话
        /// </summary>
        public virtual int Tel { get; set; }
        /// <summary>
        /// 联系人
        /// </summary>
        public virtual string CONTACTS { get; set; }
        #endregion

        #region 关系
        private ISet<Base_OrgInfo> _Orgs = null;
        public virtual ISet<Base_OrgInfo> Orgs
        {
            get
            {
                if (null == this._Orgs)
                {
                    this._Orgs = new HashSet<Base_OrgInfo>();
                }
                return this._Orgs;
            }
            set
            {
                this._Orgs = value;
            }
        }

        private ISet<Base_RoleInfo> _Roles = null;
        public virtual ISet<Base_RoleInfo> Roles
        {
            get
            {
                if (null == this._Roles)
                {
                    this._Roles = new HashSet<Base_RoleInfo>();
                }
                return this._Roles;
            }
            set
            {
                this._Roles = value;
            }
        }
        #endregion
    }

    public class Base_UserInfoMap : EntityBaseMap<Base_UserInfo>
    {
        public Base_UserInfoMap()
        {
            #region 属性映射
            Table("BASE_USERINFO");
            Map(x => x.Name);
            Map(x => x.UserName);
            Map(x => x.UserPwd);
            Map(x => x.CreateTime).ReadOnly();
            Map(x => x.State);
            Map(x => x.EMAIL);
            Map(x => x.VCODE);
            Map(x => x.VDATETIME);
            Map(x => x.CONTACTS);
            Map(x => x.Tel);
            #endregion

            #region 关系映射
            HasManyToMany<Base_OrgInfo>(o => o.Orgs)
                    .AsSet()
                    .ParentKeyColumn("UserId")
                    .ChildKeyColumn("OrgId")
                    .Table("Base_Relation_UserOrg");//.Cascade.All();

            HasManyToMany<Base_RoleInfo>(o => o.Roles)
                   .AsSet()
                   .ParentKeyColumn("UserId")
                   .ChildKeyColumn("RoleId")
                   .Table("Base_Relation_UserRole"); 


            #endregion
        }
    }
}
