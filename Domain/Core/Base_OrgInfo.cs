using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_OrgInfo : EntityBase
    {
        #region 属性
        public virtual string Code { get; set; }
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }
        public virtual string ParentOID { get; set; }
        public virtual int LT { get; set; }
        public virtual int RT { get; set; }
        public virtual int TreeLevel { get; set; }
        public virtual int OrgLevel { get; set; }
        public virtual int OrgType { get; set; }
        public virtual int OrgNo { get; set; }
        public virtual string EnglishName { get; set; }
        public virtual string ShortName { get; set; }
        public virtual string SortCode { get; set; }
        public virtual int State { get; set; }
        public virtual DateTime CreateTime { get; set; }
        public virtual bool IsDefault { get; set; }
        #endregion

        #region 关系
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

        private ISet<Base_ModuleInfo> _Modules = null;
        public virtual ISet<Base_ModuleInfo> Modules
        {
            get
            {
                if (null == this._Modules)
                {
                    this._Modules = new HashSet<Base_ModuleInfo>();
                }
                return this._Modules;
            }
            set
            {
                this._Modules = value;
            }
        }
        #endregion
    }

    public class Base_OrgInfoMap : EntityBaseMap<Base_OrgInfo>
    {
        public Base_OrgInfoMap()
        {
            #region 属性映射
            Table("BASE_ORGINFO");
            Map(x => x.Code);
            Map(x => x.Name);
            Map(x => x.Description);
            Map(x => x.ParentOID);
            Map(x => x.LT);
            Map(x => x.RT);
            Map(x => x.TreeLevel);
            Map(x => x.OrgLevel);
            Map(x=>x.OrgType);
            Map(x => x.OrgNo);
            Map(x => x.EnglishName);
            Map(x => x.ShortName);
            Map(x => x.SortCode);
            Map(x => x.State);
            Map(x => x.CreateTime).ReadOnly();
            #endregion

            #region 关系映射
            HasManyToMany<Base_UserInfo>(o => o.Users)
                .AsSet()
                .ParentKeyColumn("OrgId")
                .ChildKeyColumn("UserId")
                .Table("Base_Relation_UserOrg");
            HasManyToMany<Base_RoleInfo>(o => o.Roles)
                .AsSet()
                .ParentKeyColumn("OrgId")
                .ChildKeyColumn("RoleId")
                .Table("Base_Relation_RoleOrg");
            HasManyToMany<Base_ModuleInfo>(o => o.Modules)
                .AsSet()
                .ParentKeyColumn("OrgId")
                .ChildKeyColumn("ModuleId")
                .Table("Base_Relation_OrgModule");
            #endregion
        }
    }
}
