using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Test
{
    public class TEST_B_EXT : EntityBase
    {
        #region 属性
        /// <summary>
        /// 
        /// <summary>
        public virtual string BOID { get; set; }
        /// <summary>
        /// 
        /// <summary>
        public virtual string NAME { get; set; }
        #endregion

        #region 关系
        //public virtual TEST_B b { get; set; }
        #endregion
    }

    public class TEST_B_EXTMap : EntityBaseMap<TEST_B_EXT>
    {
        public TEST_B_EXTMap ()
        {
            #region 属性映射
            Table("TEST_B_EXT");
            Map(x => x.BOID);
            Map(x => x.NAME);
            #endregion

            #region 关系映射
            //References<TEST_B>(o => o.b).Column("BOID");
            #endregion
        }
    }
}
