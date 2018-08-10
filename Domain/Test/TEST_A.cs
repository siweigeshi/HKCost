using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Test
{
    public class TEST_A : EntityBase
    {
        #region 属性
        /// <summary>
        /// 
        /// <summary>
        public virtual string NAME { get; set; }

        public virtual string REMARK { get; set; }

        public virtual int STATE { get; set; }

        public virtual char CURSTATE { get; set; }
        #endregion

        #region 关系
        private ISet<TEST_A_DETAIL> _Detail = null;
        public virtual ISet<TEST_A_DETAIL> Detail
        {
            get
            {
                if (null == this._Detail)
                {
                    this._Detail = new HashSet<TEST_A_DETAIL>();
                }
                return this._Detail;
            }
            set
            {
                this._Detail = value;
            }
        }
        #endregion
    }

    public class TEST_AMap : EntityBaseMap<TEST_A>
    {
        public TEST_AMap ()
        {
            #region 属性映射
            Table("TEST_A");
            Map(x => x.NAME);
            Map(x => x.REMARK);
            Map(x => x.STATE);
            Map(x => x.CURSTATE);
            #endregion

            #region 关系映射
            HasMany<TEST_A_DETAIL>(o => o.Detail).AsSet().KeyColumn("AOID").Cascade.All();
            #endregion
        }
    }
}
