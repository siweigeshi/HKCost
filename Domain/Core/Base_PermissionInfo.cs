using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_PermissionInfo : EntityBase
    {
        #region 属性
        public virtual string Name { get; set; }
        public virtual string Description { get; set; }
        public virtual DateTime CreateTime { get; set; }
        #endregion

        #region 关系
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

    public class Base_PermissionInfoMap : EntityBaseMap<Base_PermissionInfo>
    {
        public Base_PermissionInfoMap ()
        {
            #region 属性映射
            Table("BASE_PERMISSIONINFO");
            Map(x => x.Name);
            Map(x => x.Description);
            Map(x => x.CreateTime).ReadOnly();
            #endregion

            #region 关系映射
            HasManyToMany<Base_ModuleInfo>(o => o.Modules)
                    .AsSet()
                    .ParentKeyColumn("PermissionId")
                    .ChildKeyColumn("ModuleId")
                    .Table("Base_Relation_PermissionModule");
            HasManyToMany<Base_RoleInfo>(o => o.Roles)
                 .AsSet()
                 .ParentKeyColumn("PermissionId")
                 .ChildKeyColumn("RoleId")
                 .Table("Base_Relation_RolePermission");
            #endregion
        }
    }
}
