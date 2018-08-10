using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Test
{
    public class TEST_A_DETAIL : EntityBase
    {
        #region 属性
        /// <summary>
        /// 
        /// <summary>
        public virtual string AOID { get; set; }
        /// <summary>
        /// 
        /// <summary>
        public virtual string NAME { get; set; }
        #endregion

        #region 关系
        #endregion
    }

    public class TEST_A_DETAILMap : EntityBaseMap<TEST_A_DETAIL>
    {
        public TEST_A_DETAILMap ()
        {
            #region 属性映射
            Table("TEST_A_DETAIL");
            Map(x => x.AOID);
            Map(x => x.NAME);
            #endregion

            #region 关系映射
            #endregion
        }
    }
}
