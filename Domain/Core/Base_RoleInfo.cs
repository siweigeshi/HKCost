using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_RoleInfo : EntityBase
    {

        #region 属性
        public virtual string Code { get; set; }
        public virtual string Name { get; set; }
        public virtual int State { get; set; }
        public virtual DateTime CreateTime { get; set; }

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

        private ISet<Base_PermissionInfo> _Permissions = null;
        public virtual ISet<Base_PermissionInfo> Permissions
        {
            get
            {
                if (null == this._Permissions)
                {
                    this._Permissions = new HashSet<Base_PermissionInfo>();
                }
                return this._Permissions;
            }
            set
            {
                this._Permissions = value;
            }
        }
        #endregion
    }

    public class Base_RoleInfoMap : EntityBaseMap<Base_RoleInfo>
    {
        public Base_RoleInfoMap()
        {
            #region 属性映射
            Table("BASE_ROLEINFO");
            Map(x => x.Code);
            Map(x => x.Name);
            Map(x => x.State);
            Map(x => x.CreateTime).ReadOnly();
            #endregion

            #region 关系映射
            HasManyToMany<Base_UserInfo>(o => o.Users)
                   .AsSet()
                   .ParentKeyColumn("RoleId")
                   .ChildKeyColumn("UserId")
                   .Table("Base_Relation_UserRole");
            HasManyToMany<Base_OrgInfo>(o => o.Orgs)
                    .AsSet()
                    .ParentKeyColumn("RoleId")
                    .ChildKeyColumn("OrgId")
                    .Table("Base_Relation_RoleOrg");
            HasManyToMany<Base_PermissionInfo>(o => o.Permissions)
                  .AsSet()
                  .ParentKeyColumn("RoleId")
                  .ChildKeyColumn("PermissionId")
                  .Table("Base_Relation_RolePermission");
            #endregion
        }
    }
}
