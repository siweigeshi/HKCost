using FluentNHibernate.Mapping;
using NHibernate.Engine;
using NHibernate.Id;
using System;

namespace Domain
{
    /// <summary>
    /// 实体基类
    /// </summary>
    public class EntityBase
    {
        // 所有继承该基类的实体主键均为OID（默认数据库主键名也必须为OID）
        //public virtual Guid OID { get; set; }
        public virtual string OID { get; set; }
    }

    /// <summary>
    /// 实体映射基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class EntityBaseMap<T> : ClassMap<T> where T : EntityBase
    {
        // 所有继承该基类的实体映射类主键均采用Nhibernate的Guidcomb方式生成主键值，该值为32位字符串(GUID)
        protected EntityBaseMap ()
        {
            //Id(x => x.OID).Not.Nullable().GeneratedBy.GuidComb().ToString().ToUpper();/原OID为GUID类型生成
            Id(x => x.OID).Not.Nullable().CustomType(typeof(string))
            .GeneratedBy.Custom(typeof(GuidStringGenerator))
            .Length(36);
            LazyLoad();
        }
    }

    public class GuidStringGenerator : IIdentifierGenerator
    {
        public object Generate (ISessionImplementor session, object obj)
        {
            return new GuidCombGenerator().Generate(session, obj).ToString().ToUpper();
        }

    }

}
