using System;

namespace Domain.Core
{
    public class Base_Buttons : EntityBase
    {
        #region 属性
        public virtual string Name { get; set; }
        public virtual string EName { get; set; }
        public virtual string Ico { get; set; }
        public virtual string EventMethod { get; set; }
        public virtual string Description { get; set; }
        public virtual int SortCode { get; set; }
        public virtual int State { get; set; }
        public virtual DateTime CreateTime { get; set; }


        #endregion

        #region 关系



        #endregion
    }

    public class Base_ButtonsMap : EntityBaseMap<Base_Buttons>
    {
        public Base_ButtonsMap()
        {
            #region 属性映射
            Table("BASE_BUTTONS");
            Map(x => x.Name);
            Map(x => x.EName);
            Map(x => x.Ico);
            Map(x => x.EventMethod);
            Map(x => x.Description);
            Map(x => x.SortCode);
            Map(x => x.State);
            Map(x => x.CreateTime).ReadOnly();
            #endregion

            #region 关系映射
            #endregion
        }
    }
}
