using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace CacheLayer
{
    /// <summary>
    /// Redis 配置文件
    /// 支持读写分离，均衡负载
    /// </summary>
    public sealed class RedisConfig : ConfigurationSection
    {
        public static RedisConfig GetConfig()
        {
            RedisConfig section = GetConfig("RedisConfig");
            return section;
        }
        public static RedisConfig GetConfig(string sectionName)
        {
            RedisConfig section = (RedisConfig)ConfigurationManager.GetSection(sectionName);
            if (section == null)
                throw new ConfigurationErrorsException("Section " + sectionName + " is not found.");
            return section;
        }
        /// <summary>
        ///Redis链接字符串，各种属性配置
        /// </summary>
        [ConfigurationProperty("ConnectionString", IsRequired = false)]
        public string ConnectionString
        {
            get
            {
                return (string)base["ConnectionString"];
            }
            set
            {
                base["ConnectionString"] = value;
            }
        }
        /// <summary>
        /// Redis链接地址URL,可多个，以“，”隔开即可
        /// </summary>
        [ConfigurationProperty("Url", IsRequired = false)]
        public string Url
        {
            get
            {
                return (string)base["Url"];
            }
            set
            {
                base["Url"] = value;
            }
        }
        /// <summary>
        /// 端口port
        /// </summary>
        [ConfigurationProperty("Port", IsRequired = false)]
        public int Port
        {
            get
            {
                return (int)base["Port"];
            }
            set
            {
                base["Port"] = value;
            }
        }
        #region 其他连接属性
        ///// <summary>
        ///// abortConnect设置为 false，这表示即使未建立 Azure Redis 缓存连接，也可成功调用
        ///// </summary>
        //[ConfigurationProperty("AbortConnect", IsRequired = false, DefaultValue = false)]
        //public bool AbortConnect
        //{
        //    get
        //    {
        //        return (bool)base["AbortConnect"];
        //    }
        //    set
        //    {
        //        base["AbortConnect"] = value;
        //    }
        //}
        ///// <summary>
        ///// SSL如果你不想使用 SSL，请设置 ssl=false 或者省略 ssl 参数。
        ////  默认情况下，将为新缓存禁用非 SSL 端口。 有关启用非 SSL 端口的说明，请参阅访问端口。
        ///// </summary>
        //[ConfigurationProperty("SSL", IsRequired = false, DefaultValue = false)]
        //public bool SSL
        //{
        //    get
        //    {
        //        return (bool)base["SSL"];
        //    }
        //    set
        //    {
        //        base["SSL"] = value;
        //    }
        //}
        /// <summary>
        /// 可写的Redis链接地址
        /// </summary>
        //[ConfigurationProperty("WriteServerConStr", IsRequired = false)]
        //public string WriteServerConStr
        //{
        //    get
        //    {
        //        return (string)base["WriteServerConStr"];
        //    }
        //    set
        //    {
        //        base["WriteServerConStr"] = value;
        //    }
        //}


        ///// <summary>
        ///// 可读的Redis链接地址
        ///// </summary>
        //[ConfigurationProperty("ReadServerConStr", IsRequired = false)]
        //public string ReadServerConStr
        //{
        //    get
        //    {
        //        return (string)base["ReadServerConStr"];
        //    }
        //    set
        //    {
        //        base["ReadServerConStr"] = value;
        //    }
        //}
        ///// <summary>
        ///// 最大写链接数
        ///// </summary>
        //[ConfigurationProperty("MaxWritePoolSize", IsRequired = false, DefaultValue = 5)]
        //public int MaxWritePoolSize
        //{
        //    get
        //    {
        //        int _maxWritePoolSize = (int)base["MaxWritePoolSize"];
        //        return _maxWritePoolSize > 0 ? _maxWritePoolSize : 5;
        //    }
        //    set
        //    {
        //        base["MaxWritePoolSize"] = value;
        //    }
        //}


        ///// <summary>
        ///// 最大读链接数
        ///// </summary>
        //[ConfigurationProperty("MaxReadPoolSize", IsRequired = false, DefaultValue = 5)]
        //public int MaxReadPoolSize
        //{
        //    get
        //    {
        //        int _maxReadPoolSize = (int)base["MaxReadPoolSize"];
        //        return _maxReadPoolSize > 0 ? _maxReadPoolSize : 5;
        //    }
        //    set
        //    {
        //        base["MaxReadPoolSize"] = value;
        //    }
        //}


        ///// <summary>
        ///// 自动重启
        ///// </summary>
        //[ConfigurationProperty("AutoStart", IsRequired = false, DefaultValue = true)]
        //public bool AutoStart
        //{
        //    get
        //    {
        //        return (bool)base["AutoStart"];
        //    }
        //    set
        //    {
        //        base["AutoStart"] = value;
        //    }
        //}

        ///// <summary>
        ///// 本地缓存到期时间，单位:秒
        ///// </summary>
        //[ConfigurationProperty("LocalCacheTime", IsRequired = false, DefaultValue = 36000)]
        //public int LocalCacheTime
        //{
        //    get
        //    {
        //        return (int)base["LocalCacheTime"];
        //    }
        //    set
        //    {
        //        base["LocalCacheTime"] = value;
        //    }
        //}


        ///// <summary>
        ///// 是否记录日志,该设置仅用于排查redis运行时出现的问题,如redis工作正常,请关闭该项
        ///// </summary>
        //[ConfigurationProperty("RecordeLog", IsRequired = false, DefaultValue = false)]
        //public bool RecordeLog
        //{
        //    get
        //    {
        //        return (bool)base["RecordeLog"];
        //    }
        //    set
        //    {
        //        base["RecordeLog"] = value;
        //    }
        //} 
        #endregion

    }
}