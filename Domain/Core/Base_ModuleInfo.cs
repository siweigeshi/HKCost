using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_ModuleInfo : EntityBase
    {
        #region 属性
        public virtual string Code { get; set; }
        public virtual string Name { get; set; }
        public virtual string EName { get; set; }
        public virtual string Ico { get; set; }
        public virtual string PathHandler { get; set; }
        public virtual string Description { get; set; }
        public virtual string Url { get; set; }
        public virtual string ParentOID { get; set; }
        public virtual int LT { get; set; }
        public virtual int RT { get; set; }
        public virtual int TreeLevel { get; set; }
        public virtual int SortCode { get; set; }
        public virtual int State { get; set; }
        public virtual int Flag { get; set; }
        public virtual DateTime CreateTime { get; set; }
        public virtual string ButtonId { get; set; }

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

        private Base_Buttons _Buttons = null;
        public virtual Base_Buttons Buttons
        {
            get
            {
                if (null == this._Buttons)
                {
                    this._Buttons = new Base_Buttons();
                }
                return this._Buttons;
            }
            set
            {
                this._Buttons = value;
            }
        }


        #endregion
    }

    public class Base_ModuleInfoMap : EntityBaseMap<Base_ModuleInfo>
    {
        public Base_ModuleInfoMap()
        {
            #region 属性映射
            Table("BASE_MODULEINFO");
            Map(x => x.Code);
            Map(x => x.Name);
            Map(x => x.EName);
            Map(x => x.Ico);
            Map(x => x.PathHandler);
            Map(x => x.Description);
            Map(x => x.Url);
            Map(x => x.ParentOID);
            Map(x => x.LT);
            Map(x => x.RT);
            Map(x => x.TreeLevel);
            Map(x => x.SortCode);
            Map(x => x.State);
            Map(x => x.Flag);
            Map(x => x.CreateTime).ReadOnly();
            Map(x => x.ButtonId);
            #endregion

            #region 关系映射
            HasManyToMany<Base_OrgInfo>(o => o.Orgs)
                    .AsSet()
                    .ParentKeyColumn("ModuleId")
                    .ChildKeyColumn("OrgId")
                    .Table("Base_Relation_OrgModule").LazyLoad();
            HasManyToMany<Base_PermissionInfo>(o => o.Permissions)
               .AsSet()
               .ParentKeyColumn("ModuleId")
               .ChildKeyColumn("PermissionId")
               .Table("Base_Relation_PermissionModule").LazyLoad();  
            #endregion
        }
    }
}
