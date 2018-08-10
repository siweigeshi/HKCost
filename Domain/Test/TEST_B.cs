using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Test
{
    public class TEST_B : EntityBase
    {
        #region 属性
        /// <summary>
        /// 
        /// <summary>
        public virtual string NAME { get; set; }
        #endregion

        #region 关系
        public virtual TEST_B_EXT b_ext { get; set; }
        #endregion
    }

    public class TEST_BMap : EntityBaseMap<TEST_B>
    {
        public TEST_BMap ()
        {
            #region 属性映射
            Table("TEST_B");
            Map(x => x.NAME);
            #endregion

            #region 关系映射
            HasOne<TEST_B_EXT>(o => o.b_ext).PropertyRef("BOID").Cascade.All();
            #endregion
        }
    }
}
