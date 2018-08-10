using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Core
{
    public class Base_Position : EntityBase
    {
        #region 属性
        public virtual string CODE { get; set; }
        public virtual string NAME { get; set; }
        public virtual int STATE { get; set; }
        public virtual string REMARK { get; set; }
        public virtual DateTime CREATETIME { get; set; }
        public virtual string CREATER { get; set; }

        #endregion

        #region 关系
        #endregion
    }

    public class Base_PositionMap : EntityBaseMap<Base_Position>
    {
        public Base_PositionMap()
        {
            #region 属性映射
            Table("BASE_POSITION");
            Map(x => x.CODE);
            Map(x => x.NAME);
            Map(x => x.STATE);
            Map(x => x.REMARK);
            Map(x => x.CREATETIME).ReadOnly();
            #endregion

            #region 关系映射
            #endregion
        }
    }
}
