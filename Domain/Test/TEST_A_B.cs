using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Test
{
    public class TEST_A_B : EntityBase
    {
        #region 属性
        /// <summary>
        /// 
        /// <summary>
        public virtual string AOID { get; set; }
        /// <summary>
        /// 
        /// <summary>
        public virtual string BOID { get; set; }
        #endregion

        #region 关系
        #endregion
    }

    public class TEST_A_BMap : EntityBaseMap<TEST_A_B>
    {
        public TEST_A_BMap ()
        {
            #region 属性映射
            Table("TEST_A_B");
            Map(x => x.AOID);
            Map(x => x.BOID);
            #endregion

            #region 关系映射
            #endregion
        }
    }
}
