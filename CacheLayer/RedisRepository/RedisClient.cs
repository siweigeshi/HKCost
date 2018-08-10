using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CacheLayer
{
    public class RedisClient : IRedisClient
    {

        #region 初始化

        private readonly IDatabase _db;
        //private  readonly ConnectionMultiplexer _redis = ReidsManager.Connection;
        private RedisConfig RedisConfig = RedisConfig.GetConfig();
        /// <summary>
        /// 构造函数
        /// </summary>
        public RedisClient()
        {
            /*
             *不建议使用每一使用都要创建连接的的方式
             * 因为ConnectionMultiplexer具有共享和重用特性
             * 最好使用加锁单例
             * 这次我们采用aure cache team 的lazy连接模型
             **/
            #region 老套连接代码封装 每次使用都创建了一次
            //const string configuration = "{0},abortConnect=false,defaultDatabase={1},ssl=false,ConnectTimeout={2},allowAdmin=true,connectRetry={3}";
            //_redis = ConnectionMultiplexer
            //    .Connect(string.Format(configuration, RedisClientConfigurations.Url,
            //        RedisClientConfigurations.DefaultDatabase, RedisClientConfigurations.ConnectTimeout,
            //        RedisClientConfigurations.ConnectRetry));
            //_redis.PreserveAsyncOrder = RedisClientConfigurations.PreserveAsyncOrder;
            //_redis.ConnectionFailed;
            #endregion

            _db = CacheManager.Cache;
        }

        #endregion

        #region Redis String数据类型操作

        /// <summary>
        /// Redis String类型 新增一条记录
        /// </summary>
        /// <typeparam name="T">generic refrence type</typeparam>
        /// <param name="key">unique key of value</param>
        /// <param name="value">value of key of type T</param>
        /// <param name="expiresAt">time span of expiration</param>
        /// <returns>true or false</returns>
        public bool StringSet<T>(string key, T value, TimeSpan? expiresAt = default(TimeSpan?), When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class
        {
            var stringContent = SerializeContent(value);
            return _db.StringSet(key, stringContent, expiresAt, when, commandFlags);
        }

        /// <summary>
        /// Redis String类型 新增一条记录
        /// </summary>
        /// <typeparam name="T">generic refrence type</typeparam>
        /// <param name="key">unique key of value</param>
        /// <param name="value">value of key of type object</param>
        /// <param name="expiresAt">time span of expiration</param>
        /// <returns>true or false</returns>
        public bool StringSet<T>(string key, object value, TimeSpan? expiresAt = default(TimeSpan?), When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class
        {
            var stringContent = SerializeContent(value);

            return _db.StringSet(key, stringContent, expiresAt, when, commandFlags);
        }

        /// <summary>
        /// Redis String数据类型 获取指定key中字符串长度
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public long StringLength(string key, CommandFlags commandFlags = CommandFlags.None)
        {
            return _db.StringLength(key, commandFlags);
        }

        /// <summary>
        ///  Redis String数据类型  返回拼接后总长度
        /// </summary>
        /// <param name="key"></param>
        /// <param name="appendVal"></param>
        /// <returns>总长度</returns>
        public long StringAppend(string key, string appendVal, CommandFlags commandFlags = CommandFlags.None)
        {
            return _db.StringAppend(key, appendVal, commandFlags);
        }

        /// <summary>
        /// 设置新值并且返回旧值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="newVal"></param>
        /// <param name="commandFlags"></param>
        /// <returns>OldVal</returns>
        public string StringGetAndSet(string key, string newVal, CommandFlags commandFlags = CommandFlags.None)
        {
            return DeserializeContent<string>(_db.StringGetSet(key, newVal, commandFlags));
        }

        /// <summary>
        /// 更新时应使用此方法，代码更可读。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="expiresAt"></param>
        /// <param name="when"></param>
        /// <param name="commandFlags"></param>
        /// <returns></returns>
        public bool StringUpdate<T>(string key, T value, TimeSpan expiresAt, When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class
        {
            var stringContent = SerializeContent(value);
            return _db.StringSet(key, stringContent, expiresAt, when, commandFlags);
        }

        /// <summary>
        /// 为数字增长val
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val">可以为负</param>
        /// <param name="commandFlags"></param>
        /// <returns>增长后的值</returns>
        public double StringIncrement(string key, double val, CommandFlags commandFlags = CommandFlags.None)
        {
            return _db.StringIncrement(key, val, commandFlags);
        }

        /// <summary>
        /// Redis String类型  Get
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns>T</returns>
        public T StringGet<T>(string key, CommandFlags commandFlags = CommandFlags.None) where T : class
        {
            try
            {
                RedisValue myString = _db.StringGet(key, commandFlags);
                if (myString.HasValue && !myString.IsNullOrEmpty)
                {
                    return DeserializeContent<T>(myString);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                // Log Exception
                return null;
            }
        }

        /// <summary>
        ///  Redis String类型
        /// 类似于模糊查询  key* 查出所有key开头的键
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="pageSize"></param>
        /// <param name="commandFlags"></param>
        /// <returns>List<T></returns>
        public List<T> StringGetList<T>(string key, int pageSize = 1000, CommandFlags commandFlags = CommandFlags.None) where T : class
        {
            try
            {
                var server = CacheManager.Connection.GetServer(host: RedisConfig.Url,
                                              port: RedisConfig.Port);
                var keys = server.Keys(_db.Database, key, pageSize, commandFlags);
                var keyValues = _db.StringGet(keys.ToArray(), commandFlags);

                var result = new List<T>();
                foreach (var redisValue in keyValues)
                {
                    if (redisValue.HasValue && !redisValue.IsNullOrEmpty)
                    {
                        var item = DeserializeContent<T>(redisValue);
                        result.Add(item);
                    }
                }

                return result;
            }
            catch (Exception)
            {
                // Log Exception
                return null;
            }
        }

        #endregion

        #region Redis Hash散列数据类型操作
        /// <summary>
        /// Redis散列数据类型  批量新增
        /// </summary>
        public void HashSet(string key, List<HashEntry> hashEntrys, CommandFlags flags = CommandFlags.None)
        {
            _db.HashSet(key, hashEntrys.ToArray(), flags);
        }
        /// <summary>
        /// Redis散列数据类型  新增一个
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="val"></param>
        public void HashSet<T>(string key, string field, T val, When when = When.Always, CommandFlags flags = CommandFlags.None)
        {
            _db.HashSet(key, field, SerializeContent(val), when, flags);
        }
        public void HaseSetIgnores<T>(string key, string field, T val, List<string> ignores, When when = When.Always, CommandFlags flags = CommandFlags.None)
        {
            _db.HashSet(key, field, SerializeContent(val,ignores), when, flags);
        }
        /// <summary>
        ///  Redis散列数据类型 获取指定key的指定field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        public T HashGet<T>(string key, string field)
        {
            return DeserializeContent<T>(_db.HashGet(key, field));
        }
        /// <summary>
        ///  Redis散列数据类型 获取所有field所有值,以 HashEntry[]形式返回
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public HashEntry[] HashGetAll(string key, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashGetAll(key, flags);
        }
        /// <summary>
        /// Redis散列数据类型 获取key中所有field的值。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public List<T> HashGetAllValues<T>(string key, CommandFlags flags = CommandFlags.None)
        {
            List<T> list = new List<T>();
            var hashVals = _db.HashValues(key, flags).ToArray();
            foreach (var item in hashVals)
            {
                list.Add(DeserializeContent<T>(item));
            }
            return list;
        }

        /// <summary>
        /// Redis散列数据类型 获取所有Key名称
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public string[] HashGetAllKeys(string key, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashKeys(key, flags).ToStringArray();
        }
        /// <summary>
        ///  Redis散列数据类型  单个删除field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="hashField"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public bool HashDelete(string key, string hashField, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashDelete(key, hashField, flags);
        }
        /// <summary>
        ///  Redis散列数据类型  批量删除field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="hashFields"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public long HashDelete(string key, string[] hashFields, CommandFlags flags = CommandFlags.None)
        {
            List<RedisValue> list = new List<RedisValue>();
            for (int i = 0; i < hashFields.Length; i++)
            {
                list.Add(hashFields[i]);
            }
            return _db.HashDelete(key, list.ToArray(), flags);
        }
        /// <summary>
        ///  Redis散列数据类型 判断指定键中是否存在此field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public bool HashExists(string key, string field, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashExists(key, field, flags);
        }
        /// <summary>
        /// Redis散列数据类型  获取指定key中field数量
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public long HashLength(string key, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashLength(key, flags);
        }
        /// <summary>
        /// Redis散列数据类型  为key中指定field增加incrVal值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="incrVal"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        public double HashIncrement(string key, string field, double incrVal, CommandFlags flags = CommandFlags.None)
        {
            return _db.HashIncrement(key, field, incrVal, flags);
        }
        #endregion

        #region Redis List列表数据类型操作
        /// <summary>
        /// Redis List数据类型
        /// 返回在键存储的列表中的索引索引处的元素
        /// 索引是基于零，因此0表示第一个元素，1表示第二个元素，依此类推
        ///  负索引可用于指定从列表尾部开始的元素。这里，-1表示最后一个元素，-2表示倒数第二个等等。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">存储key</param>
        /// <param name="index">索引值</param>
        /// <param name="flags"></param>
        /// <returns>返回的任意类型值,超出范围时为值为nil</returns>
        public T ListGetByIndex<T>(string key, long index, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return DeserializeContent<T>(_db.ListGetByIndex(key, index, flags));
            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 在键存储的列表中 value pivot支点之后插入值
        /// 价值支点。当键不存在时，它被认为是一个空列表，不执行任何操作。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="pivot">插入值支点/参照</param>
        /// <param name="value">插入的任意类型值</param>
        /// <param name="flags"></param>
        /// <returns>插入操作后的列表长度，或者未找到值pivot时为-1。</returns>
        public long ListInsertAfter<T>(string key, T pivot, T value, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return _db.ListInsertAfter(key, SerializeContent(pivot), SerializeContent(value), flags);
            }
            catch (Exception)
            {
                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 在键存储的列表中 value pivot支点之前插入值
        /// 价值支点。当键不存在时，它被认为是一个空列表，不执行任何操作。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="pivot">插入值支点/参照</param>
        /// <param name="value">插入的任意类型值</param>
        /// <param name="flags"></param>
        /// <returns>插入操作后的列表长度，或者未找到值pivot时为-1。</returns>
        public long ListInsertBefore<T>(string key, T pivot, T value, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return _db.ListInsertBefore(key, SerializeContent(pivot), SerializeContent(value), flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }

        }
        /// <summary>
        /// 删除并返回存储在键的列表的第一个元素。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="flags"></param>
        /// <returns>第一个元素的值，或者当key不存在时为nil。</returns>
        public T ListLeftPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return DeserializeContent<T>(_db.ListLeftPop(key, flags));
            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 批量推送存储值 依次左排
        /// 将所有指定的多个值插入存储在键的列表的开头.如果key不存在，则在执行推送操作之前将其创建为空列表.元素被一个接一个插入列表的头部，从最左边的元素到最右边的元素。因此，例如命令LPUSH mylist a b c将导致包含c作为第一元素，b作为第二元素和a作为第三元素的列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="values">批量推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        public long ListLeftPush<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<RedisValue> list = new List<RedisValue>();
                foreach (var item in values)
                {
                    list.Add(SerializeContent(item));
                }
                return _db.ListLeftPush(key, list.ToArray(), flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 将指定的值插入存储在键的列表的开头。如果键不存在，则在执行推送操作之前将其创建为空列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="values">推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        public long ListLeftPush<T>(string key, T value, When when = When.Always, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return _db.ListLeftPush(key, SerializeContent(value), when, flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 返回存储在键的列表的长度。如果键不存在它被解释为一个空列表，并返回0.
        /// </summary>
        /// <param name="key">键值</param>
        /// <param name="flags"></param>
        /// <returns>键的列表长度</returns>
        public long ListLength(string key, CommandFlags flags = CommandFlags.None)
        {
            return _db.ListLength(key, flags);
        }
        /// <summary>
        /// 返回存储在键的列表的指定元素
        /// 开始的偏移量和停止是基于零的索引，0是列表的第一个元素（列表的头部），1是下一个元素，以此类推。这些偏移也可以是指示从结束处开始的偏移的负数列表。例如，-1是列表的最后一个元素，-2是倒数第二个，等等。注意，如果你有一个从0到100的数字列表，LRANGE列表0 10将返回11个元素，也就是说，包括最右边的项目。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="start">开始索引数</param>
        /// <param name="stop">结束索引数</param>
        /// <param name="flags"></param>
        /// <returns>返回指定范围内的元素列表</returns>
        public List<T> ListRange<T>(string key, long start = 0, long stop = -1, CommandFlags flags = CommandFlags.None) where T : class
        {

            try
            {
                List<T> list = new List<T>();
                var listVals = _db.ListRange(key, start, stop, flags).ToArray();
                foreach (var item in listVals)
                {
                    list.Add(DeserializeContent<T>(item));
                }
                return list;
            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 从存储在键的列表中删除等于值的元素的第一数。计数参数影响下面的操作
        /// 方法：count> 0：删除等于从头到尾移动的值的元素。
        /// count <0：删除等于从尾部到头部的值的元素    
        /// count = 0：删除所有等于value的元素。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="value">删除指定的值</param>
        /// <param name="count">计数(删除范围)</param>
        /// <param name="flags"></param>
        /// <returns>删除元素的数量</returns>
        public long ListRemove<T>(string key, T value, long count = 0, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return _db.ListRemove(key, SerializeContent(value), count, flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 删除并返回存储在键的列表的最后一个元素。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="flags"></param>
        /// <returns>返回删除的元素</returns>
        public T ListRightPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return DeserializeContent<T>(_db.ListRightPop(key, flags));

            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 以原子方式返回并删除存储在源处的列表的最后一个元素（尾部），并将元素推送到存储在目标的列表的第一个元素（头部）
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="source">源key</param>
        /// <param name="destination">目标key</param>
        /// <param name="flags"></param>
        /// <returns>返回被推送和弹出的元素</returns>
        public T ListRightPopLeftPush<T>(string source, string destination, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return DeserializeContent<T>(_db.ListRightPopLeftPush(source, destination, flags));
            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }

        }
        /// <summary>
        /// 批量推送以此右排
        /// 将所有指定的多个值插入存储在键的列表的尾部.如果key不存在，则在执行推送操作之前将其创建为空列表.元素被一个接一个插入列表的尾部，从最左边的元素到最右边的元素。因此，例如命令RPUSH mylist a b c将导致包含a作为第一元素，b作为第二元素和c作为第三元素的列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="values">批量推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        public long ListRightPush<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<RedisValue> list = new List<RedisValue>();
                foreach (var item in values)
                {
                    list.Add(SerializeContent(item));
                }
                return _db.ListRightPush(key, list.ToArray(), flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 将指定的值插入存储在键的列表的尾部。如果键不存在，则在执行推送操作之前将其创建为空列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="values">推存的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        public long ListRightPush<T>(string key, T value, When when = When.Always, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                return _db.ListRightPush(key, SerializeContent(value), when, flags);
            }
            catch (Exception)
            {

                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 设置列表中索引处的元素值
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键值</param>
        /// <param name="index">索引数</param>
        /// <param name="value">设置的值</param>
        /// <param name="flags"></param>
        public void ListSetByIndex<T>(string key, long index, T value, CommandFlags flags = CommandFlags.None)
        {
            _db.ListSetByIndex(key, index, SerializeContent(value), flags);
        }
        /// <summary>
        /// 修剪现有列表，使其仅包含指定的指定范围的元素。 
        /// start和stop都是从零开始的索引，其中0是列表的第一个元素（head），1是下一个元素，依此类推。例如：LTRIM foobar 0 2将修改存储在foobar的列表，以便只保留列表的前三个元素。 start和end也可以是指示从列表末尾偏移的负数，其中-1是列表的最后一个元素，-2是倒数第二个元素，依此类推。
        /// </summary>
        /// <param name="key">键值</param>
        /// <param name="start">开始索引数</param>
        /// <param name="stop">结束索引数</param>
        /// <param name="flags"></param>
        public void ListTrim(string key, long start, long stop, CommandFlags flags = CommandFlags.None)
        {
            _db.ListTrim(key, start, stop, flags);
        }
        #endregion

        #region Redis Set集合数据类型操作
        /// <summary>
        /// 将指定的成员添加到存储键的集合。
        /// 已经是此集合的成员的指定成员将被忽略。
        /// 如果key不存在，则在添加指定成员之前创建一个新集合。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">存储值</param>
        /// <param name="flags"></param>
        /// <returns>如果指定的成员在集合中不存在，则为True，否则为False</returns>
        public bool SetAdd<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class
        {

            return _db.SetAdd(key, SerializeContent(value), flags);
        }
        /// <summary>
        /// 批量存储键集合
        /// 将指定的成员添加到存储在键的集合。指定成员已经是这个集合的成员被忽略。
        /// 如果key不存在，一个新的set在添加指定的成员之前创建。
        /// </summary>
        /// <typeparam name="T">指定类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">批量存储到集合的值</param>
        /// <param name="flags"></param>
        /// <returns>添加到集合的元素数，不包括所有元素已经存在于集合中。</returns>
        public long SetAdd<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<RedisValue> _value = new List<RedisValue>();
                if (values != null & values.Count > 0)
                {
                    foreach (var item in values)
                    {
                        _value.Add(SerializeContent(item));
                    }
                }
                return _db.SetAdd(key, _value.ToArray(), flags);
            }
            catch (Exception)
            {
                // Log Exception
                return -0;
            }


        }
        /// <summary>
        /// 返回从给定集合的指定操作产生的集合的成员。
        /// </summary>
        /// <typeparam name="T">指定类型</typeparam>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="keys">给定集合的键(两个以上)</param>
        /// <param name="flags"></param>
        /// <returns>结果集的成员列表</returns>
        public List<T> SetCombine<T>(SetOperation operation, string[] keys, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<T> list = new List<T>();
                RedisKey[] _keys = new RedisKey[keys.Length];
                for (int i = 0; i < keys.Length; i++)
                {
                    _keys[i] = keys[i];
                }
                var _r = _db.SetCombine(operation, _keys, flags).ToArray();
                foreach (var item in _r)
                {
                    list.Add(DeserializeContent<T>(item));
                }
                return list;
            }
            catch (Exception)
            {
                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 返回从给定集合的指定操作产生的集合的成员。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="first">给定的第一个集合键</param>
        /// <param name="second">给定的第二个集合键</param>
        /// <param name="flags"></param>
        /// <returns>结果集的成员列表</returns>
        public List<T> SetCombine<T>(SetOperation operation, string first, string second, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<T> list = new List<T>();
                var _r = _db.SetCombine(operation, first, second, flags).ToArray();
                foreach (var item in _r)
                {
                    list.Add(DeserializeContent<T>(item));
                }
                return list;

            }
            catch (Exception)
            {
                // Log Exception
                return null;
            }

        }
        // <summary>
        /// 此命令等于SetCombine，但不是返回结果集，而是存储在目标中。如果目标已存在，它将被覆盖。
        /// </summary>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="destination">目标集合的键</param>
        /// <param name="keys">给定集合的键(两个以上)</param>
        /// <param name="flags"></param>
        /// <returns>目标结果集中元素数量</returns>
        public long SetCombineAndStore(SetOperation operation, string destination, string[] keys, CommandFlags flags = CommandFlags.None)
        {
            try
            {
                RedisKey[] _keys = new RedisKey[keys.Length];
                for (int i = 0; i < keys.Length; i++)
                {
                    _keys[i] = keys[i];
                }
                return _db.SetCombineAndStore(operation, destination, _keys, flags);

            }
            catch (Exception)
            {
                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 此命令等于SetCombine，但不是返回结果集，而是存储在目标中。如果目标已存在，它将被覆盖。
        /// </summary>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="destination">目标键</param>
        /// <param name="first">给定的第一个集合键</param>
        /// <param name="second">给定的第二个集合键</param>
        /// <param name="flags"></param>
        /// <returns>目标结果集中元素数量</returns>
        public long SetCombineAndStore(SetOperation operation, string destination, string first, string second, CommandFlags flags = CommandFlags.None)
        {
            try
            {

                return _db.SetCombineAndStore(operation, destination, first, second, flags);

            }
            catch (Exception)
            {
                // Log Exception
                return -0;
            }
        }
        /// <summary>
        /// 判断值元素是否存在集合内
        /// 如果值是存储键的集合的成员，则返回。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <param name="flags"></param>
        /// <returns>1如果元素是集合成员.0如果元素不是集合成员，或者集合键就不存在</returns>
        public bool SetContains<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class
        {
            return _db.SetContains(key, SerializeContent(value), flags);
        }
        /// <summary>
        /// 返回存储键集合的成员数量
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>返回集合的成员数，或者如果键不存在返回0</returns>
        public long SetLength(string key, CommandFlags flags = CommandFlags.None)
        {
            return _db.SetLength(key, flags);
        }
        /// <summary>
        /// 返回存储键集合的所有值
        /// 返回在key存储的设置值的所有成员。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>集合所有成员</returns>
        public List<T> SetMembers<T>(string key, CommandFlags flags = CommandFlags.None) where T : class
        {
            List<T> _values = new List<T>();
            var _r = _db.SetMembers(key, flags);
            foreach (var item in _r)
            {
                _values.Add(DeserializeContent<T>(item));
            }
            return _values;
        }
        /// <summary>
        /// 把值从源集转移到目标集
        /// 此操作是原子操作。在每个给定时刻，元素将显示为其他客户端的源或目标的成员。
        /// 当指定的元素已经存在于目标集中，则它只会从源集中删除。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="source">源键</param>
        /// <param name="destination">目标键</param>
        /// <param name="value">转移对象值</param>
        /// <param name="flags"></param>
        /// <returns>返回1如果元素已经被转移。0如果元素不是源的成员并且未执行任何操作</returns>
        public bool SetMove<T>(string source, string destination, T value, CommandFlags flags = CommandFlags.None) where T : class
        {
            return _db.SetMove(source, destination, SerializeContent
                (value), flags);
        }
        /// <summary>
        /// 随机删除并返回一个元素
        /// 从存储键设置值删除并返回一个随机元素
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>删除的元素，或者nil当键不存在的时</returns>
        public T SetPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class
        {
            return DeserializeContent<T>(_db.SetPop(key, flags));
        }
        /// <summary>
        /// 随机返回一个随机元素
        /// 从存储键设置值中返回一个随机元素
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>随机选择的元素，或者nil当键不存在时</returns>
        public T SetRandomMember<T>(string key, CommandFlags flags = CommandFlags.None) where T : class
        {
            return DeserializeContent<T>(_db.SetRandomMember(key, flags));
        }
        /// <summary>
        /// 如果count为正，返回一个计数不同元素的数组。
        /// 如果调用与负数计数行为更改和命令允许多次返回相同的元素。
        /// 在这种情况下，返回的元素的数字是指定计数的绝对值。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="count">计数</param>
        /// <param name="flags"></param>
        /// <returns>随机返回一个元素集合，或者一个空集合当键不存在时</returns>
        public List<T> SetRandomMembers<T>(string key, long count, CommandFlags flags = CommandFlags.None) where T : class
        {
            try
            {
                List<T> _values = new List<T>();
                var _r = _db.SetRandomMembers(key, count, flags);
                foreach (var item in _r)
                {
                    _values.Add(DeserializeContent<T>(item));
                }
                return _values;
            }
            catch (Exception)
            {

                // Log Exception
                return null;
            }
        }
        /// <summary>
        /// 从存储键集合中移除指定成员，如果此成员不是这个集合则忽略
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">移除对象值</param>
        /// <param name="flags"></param>
        /// <returns>如果此指定成员已经存在集合中返回True，否则False</returns>
        public bool SetRemove<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class
        {
            return _db.SetRemove(key, SerializeContent(value), flags);
        }
        /// <summary>
        /// 批量移除
        /// 从存储键集合中移除指定成员(多个)，如果此成员不是集合成员则忽略。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">移除的值</param>
        /// <param name="flags"></param>
        /// <returns>从集合中移除的成员数量，不包括非现有的成员</returns>
        public long SetRemove<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class
        {
            List<RedisValue> _value = new List<RedisValue>();
            foreach (var item in values)
            {
                _value.Add(SerializeContent(item));
            }
            return _db.SetRemove(key, _value.ToArray(), flags);
        }
        #endregion

        #region Redis Sort Set有序集合数据类型操作

        #endregion

        #region Redis各数据类型公用

        /// <summary>
        /// Redis中是否存在指定Key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public bool KeyExists(string key, CommandFlags commandFlags = CommandFlags.None)
        {
            return _db.KeyExists(key, commandFlags);
        }

        /// <summary>
        /// Dispose DB connection 释放DB相关链接
        /// </summary>
        public void DbConnectionStop()
        {
            CacheManager.Connection.Dispose();
        }

        /// <summary>
        /// 从Redis中移除键
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public bool KeyRemove(string key, CommandFlags commandFlags = CommandFlags.None)
        {
            return _db.KeyDelete(key, commandFlags);
        }
        /// <summary>
        /// 从Redis中移除多个键
        /// </summary>
        /// <param name="keys"></param>
        public void KeyRemove(RedisKey[] keys, CommandFlags commandFlags = CommandFlags.None)
        {
            _db.KeyDelete(keys, commandFlags);
        }
        #endregion

        #region 私有公用方法

        // serialize and Deserialize content in separate functions as redis can save value as array of binary. 
        // so, any time you need to change the way of handling value, do it here.

        private string SerializeContent(object value)
        {
            return JsonConvert.SerializeObject(value);
        }
        private string SerializeContent(object value, List<string> ignores)
        {
            return Common.NewtonJsonHelper.Serialize(value, ignores);
        }
        private T DeserializeContent<T>(RedisValue myString)
        {
            return JsonConvert.DeserializeObject<T>(myString);
        }


        #endregion

        #region Redis简易消息队列使用list数据结构Push/Pop 生产者/消费者模式

        /// <summary>
        /// 消息队列 入列
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <param name="value">值</param>
        public void EnqueueItemOnList(string listId, string value)
        {
            _db.ListLeftPush(listId, value);
        }
        /// <summary>
        /// 消息队列 出列
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <returns>值</returns>
        public string DequeueItemFromList(string listId)
        {
            return _db.ListRightPop(listId);
        }
        /// <summary>
        /// 消息队列 入列 
        /// value泛型
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <param name="value">值</param>
        public void EnqueueItemOnList<T>(string listId, T value) where T : class
        {
            this.ListLeftPush<T>(listId, value);
        }
        /// <summary>
        /// 消息队列 出列 
        /// value泛型
        /// </summary>
        /// <param name="listId">队列键</param>
        /// <returns></returns>
        public T DequeueItemFromList<T>(string listId) where T : class
        {
            return this.ListRightPop<T>(listId);
        }

        #endregion
    }
}
