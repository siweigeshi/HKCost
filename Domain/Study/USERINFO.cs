using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Study
{
    public class USERINFO : EntityBase
    {
        #region 属性
        public virtual string NAME { get; set; }
        public virtual string USERNAME { get; set; }
        public virtual string TELPHONE { get; set; }
        public virtual string EMAIL { get; set; }
        public virtual string PROVINCE { get; set; }
        public virtual string CITY { get; set; }
        public virtual string CREATER { get; set; }
        public virtual string PASSWORD { get; set; }
        #endregion

        #region 关系
        
        #endregion
    }

    public class USERINFOMap : EntityBaseMap<USERINFO>
    {
        public USERINFOMap()
        {
            #region 属性映射
            Table("USERINFO");
            Map(x => x.NAME);
            Map(x => x.USERNAME);
            Map(x => x.TELPHONE);
            Map(x => x.EMAIL);
            Map(x => x.PROVINCE);
            Map(x => x.CITY);
            Map(x => x.CREATER);
            Map(x=>x.PASSWORD);
            #endregion

            #region 关系映射
            #endregion
        }
    }
}