using System;
using System.Collections.Generic;

namespace Domain.Core
{
    public class Base_Dictionary : EntityBase
    {
        #region 属性
        /// <summary>
        /// 说明[标题]
        /// <summary>
        public virtual string TITLE { get; set; }
        /// <summary>
        /// 内容
        /// <summary>
        public virtual string CONTENT { get; set; }
        /// <summary>
        /// 对应字段名称
        /// <summary>
        public virtual string FILENAME { get; set; }
        /// <summary>
        /// 备注
        /// <summary>
        public virtual string REMARK { get; set; }
        /// <summary>
        /// 状态0启用1禁用
        /// <summary>
        public virtual int STATE { get; set; }
        #endregion

        #region 关系
        #endregion
    }

    public class Base_DictionaryMap : EntityBaseMap<Base_Dictionary>
    {
        public  Base_DictionaryMap()
        {
            #region 属性映射
            Table("BASE_DICTIONARY");
            Map(x => x.TITLE);
            Map(x => x.CONTENT);
            Map(x => x.FILENAME);
            Map(x => x.REMARK);
            Map(x => x.STATE);
            #endregion

            #region 关系映射
            #endregion
        }
    }
}
