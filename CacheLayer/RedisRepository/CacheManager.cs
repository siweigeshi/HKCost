using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CacheLayer
{
    /// <summary>
    /// Redis连接管理
    /// 使用Lazy真正需要连接的时候创建连接，如果服务器断开，后台自动连接。
    /// the pattern recommended by the Azure Redis Cache team
    /// 它采用懒<T>处理线程安全初始化
    /// 它集“abortConnect = false”时，
    /// 这意味着如果初始连接尝试失败，将ConnectionMultiplexer默默地在后台重试，而不是抛出一个异常。
    /// 它不检查IsConnected属性，因为如果连接中断ConnectionMultiplexer会在后台自动重试。
    /// </summary>
    public static class CacheManager
    {
        private static RedisConfig RedisConfig = RedisConfig.GetConfig();
        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            //192.168.0.70:6379,allowAdmin=true，abortConnect=false
            return ConnectionMultiplexer.Connect(RedisConfig.ConnectionString);
        });

        public static ConnectionMultiplexer Connection
        {
            get
            {
                return lazyConnection.Value;
            }
        }
        public static IDatabase Cache
        {
            get
            {
                return Connection.GetDatabase();
            }
        }
        public static IServer Server
        {
            get
            {
                return Connection.GetServer(RedisConfig.Url, RedisConfig.Port);
            }
        }
        private static IRedisClient _RedisClient = null;
        public static IRedisClient RedisClient
        {
            get
            {
                if (_RedisClient == null)
                {
                    _RedisClient = new RedisClient();
                }
                return _RedisClient;
            }

        }
    }
}