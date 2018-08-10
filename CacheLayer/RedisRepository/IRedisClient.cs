using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CacheLayer
{
    public interface IRedisClient
    {
        #region Redis String类型操作
        /// <summary>
        /// Redis String类型 新增一条记录
        /// </summary>
        /// <typeparam name="T">generic refrence type</typeparam>
        /// <param name="key">unique key of value</param>
        /// <param name="value">value of key of type object</param>
        /// <param name="expiresAt">time span of expiration</param>
        /// <param name= "when">枚举类型</param>
        /// <param name="commandFlags"></param>
        /// <returns>true or false</returns>
        bool StringSet<T>(string key, object value, TimeSpan? expiry = default(TimeSpan?), When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class;

        /// <summary>
        /// Redis String类型 新增一条记录
        /// </summary>
        /// <typeparam name="T">generic refrence type</typeparam>
        /// <param name="key">unique key of value</param>
        /// <param name="value">value of key of type object</param>
        /// <param name="expiresAt">time span of expiration</param>
        /// <param name= "when">枚举类型</param>
        /// <param name="commandFlags"></param>
        /// <returns>true or false</returns>
        bool StringSet<T>(string key, T value, TimeSpan? expiry = default(TimeSpan?), When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class;

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
        bool StringUpdate<T>(string key, T value, TimeSpan expiresAt, When when = When.Always, CommandFlags commandFlags = CommandFlags.None) where T : class;

        /// <summary>
        /// Redis String类型  Get
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="commandFlags"></param>
        /// <returns>T</returns>
        T StringGet<T>(string key, CommandFlags commandFlags = CommandFlags.None) where T : class;

        /// <summary>
        /// Redis String数据类型 获取指定key中字符串长度
        /// </summary>
        /// <param name="key"></param>
        /// <param name="commandFlags"></param>
        /// <returns></returns>
        long StringLength(string key, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        ///  Redis String数据类型  返回拼接后总长度
        /// </summary>
        /// <param name="key"></param>
        /// <param name="appendVal"></param>
        /// <param name="commandFlags"></param>
        /// <returns>总长度</returns>
        long StringAppend(string key, string appendVal, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// 设置新值并且返回旧值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="newVal"></param>
        /// <param name="commandFlags"></param>
        /// <returns>OldVal</returns>
        string StringGetAndSet(string key, string newVal, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// 为数字增长val
        /// </summary>
        /// <param name="key"></param>
        /// <param name="val"></param>
        /// <param name="commandFlags"></param>
        /// <returns>增长后的值</returns>
        double StringIncrement(string key, double val, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// Redis String数据类型
        /// 类似于模糊查询  key* 查出所有key开头的键
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="pageSize"></param>
        /// <param name="commandFlags"></param>
        /// <returns>返回List<T></returns>
        List<T> StringGetList<T>(string key, int pageSize = 1000, CommandFlags commandFlags = CommandFlags.None) where T : class;
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
        T ListGetByIndex<T>(string key, long index, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 在键存储的列表中 value pivot支点之后插入值
        /// 价值支点。当键不存在时，它被认为是一个空列表，不执行任何操作。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="pivot">插入值支点/参照</param>
        /// <param name="value">插入的任意类型值</param>
        /// <param name="flags"></param>
        /// <returns>插入操作后的列表长度，或者未找到值pivot时为-1。</returns>
        long ListInsertAfter<T>(string key, T pivot, T value, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 在键存储的列表中 value pivot支点之前插入值
        /// 价值支点。当键不存在时，它被认为是一个空列表，不执行任何操作。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="pivot">插入值支点/参照</param>
        /// <param name="value">插入的任意类型值</param>
        /// <param name="flags"></param>
        /// <returns>插入操作后的列表长度，或者未找到值pivot时为-1。</returns>
        long ListInsertBefore<T>(string key, T pivot, T value, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 删除并返回存储在键的列表的第一个元素。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>第一个元素的值，或者当key不存在时为nil。</returns>
        T ListLeftPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 批量推送存储值 依次左排
        /// 将所有指定的多个值插入存储在键的列表的开头.如果key不存在，则在执行推送操作之前将其创建为空列表.元素被一个接一个插入列表的头部，从最左边的元素到最右边的元素。因此，例如命令LPUSH mylist a b c将导致包含c作为第一元素，b作为第二元素和a作为第三元素的列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">批量推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        long ListLeftPush<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 将指定的值插入存储在键的列表的开头。如果键不存在，则在执行推送操作之前将其创建为空列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        long ListLeftPush<T>(string key, T value, When when = When.Always, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 返回存储在键的列表的长度。如果键不存在它被解释为一个空列表，并返回0.
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>键的列表长度</returns>
        long ListLength(string key, CommandFlags flags = CommandFlags.None);
        /// <summary>
        /// 返回存储在键的列表的指定元素
        /// 开始的偏移量和停止是基于零的索引，0是列表的第一个元素（列表的头部），1是下一个元素，以此类推。这些偏移也可以是指示从结束处开始的偏移的负数列表。例如，-1是列表的最后一个元素，-2是倒数第二个，等等。注意，如果你有一个从0到100的数字列表，LRANGE列表0 10将返回11个元素，也就是说，包括最右边的项目。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="start">开始索引数</param>
        /// <param name="stop">结束索引数</param>
        /// <param name="flags"></param>
        /// <returns>返回指定范围内的元素列表</returns>
        List<T> ListRange<T>(string key, long start = 0, long stop = -1, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 从存储在键的列表中删除等于值的元素的第一数。计数参数影响下面的操作
        /// 方法：count> 0：删除等于从头到尾移动的值的元素。
        /// count <0：删除等于从尾部到头部的值的元素    
        /// count = 0：删除所有等于value的元素。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">删除指定的值</param>
        /// <param name="count">计数(删除范围)</param>
        /// <param name="flags"></param>
        /// <returns>删除元素的数量</returns>
        long ListRemove<T>(string key, T value, long count = 0, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 删除并返回存储在键的列表的最后一个元素。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>返回删除的元素</returns>
        T ListRightPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 以原子方式返回并删除存储在源处的列表的最后一个元素（尾部），并将元素推送到存储在目标的列表的第一个元素（头部）
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="source">源key</param>
        /// <param name="destination">目标key</param>
        /// <param name="flags"></param>
        /// <returns>返回被推送和弹出的元素</returns>
        T ListRightPopLeftPush<T>(string source, string destination, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 批量推送 依次右排
        /// 将所有指定的多个值插入存储在键的列表的尾部.如果key不存在，则在执行推送操作之前将其创建为空列表.元素被一个接一个插入列表的尾部，从最左边的元素到最右边的元素。因此，例如命令RPUSH mylist a b c将导致包含a作为第一元素，b作为第二元素和c作为第三元素的列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">批量推送的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        long ListRightPush<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 将指定的值插入存储在键的列表的尾部。如果键不存在，则在执行推送操作之前将其创建为空列表。
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">推存的存储值</param>
        /// <param name="flags"></param>
        /// <returns>推送操作后列表的长度</returns>
        long ListRightPush<T>(string key, T value, When when = When.Always, CommandFlags flags = CommandFlags.None) where T : class;
        /// <summary>
        /// 设置列表中索引处的元素值
        /// </summary>
        /// <typeparam name="T">设置值类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="index">索引数</param>
        /// <param name="value">设置的值</param>
        /// <param name="flags"></param>
        void ListSetByIndex<T>(string key, long index, T value, CommandFlags flags = CommandFlags.None);
        /// <summary>
        /// 修剪现有列表，使其仅包含指定的指定范围的元素。 
        /// start和stop都是从零开始的索引，其中0是列表的第一个元素（head），1是下一个元素，依此类推。例如：LTRIM foobar 0 2将修改存储在foobar的列表，以便只保留列表的前三个元素。 start和end也可以是指示从列表末尾偏移的负数，其中-1是列表的最后一个元素，-2是倒数第二个元素，依此类推。
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="start">开始索引数</param>
        /// <param name="stop">结束索引数</param>
        /// <param name="flags"></param>
        void ListTrim(string key, long start, long stop, CommandFlags flags = CommandFlags.None);
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
        bool SetAdd<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class;

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
        long SetAdd<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class;

        /// <summary>
        /// 返回从给定集合的指定操作产生的集合的成员。
        /// </summary>
        /// <typeparam name="T">指定类型</typeparam>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="keys">给定集合的键(两个以上)</param>
        /// <param name="flags"></param>
        /// <returns>结果集的成员列表</returns>
        List<T> SetCombine<T>(SetOperation operation, string[] keys, CommandFlags flags = CommandFlags.None) where T : class;

        /// <summary>
        /// 返回从给定集合的指定操作产生的集合的成员。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="first">给定的第一个集合键</param>
        /// <param name="second">给定的第二个集合键</param>
        /// <param name="flags"></param>
        /// <returns>结果集的成员列表</returns>
        List<T> SetCombine<T>(SetOperation operation, string first, string second, CommandFlags flags = CommandFlags.None) where T : class;

        /// <summary>
        /// 此命令等于SetCombine，但不是返回结果集，而是存储在目标中。如果目标已存在，它将被覆盖。
        /// </summary>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="destination">目标集合的键</param>
        /// <param name="keys">给定集合的键(两个以上)</param>
        /// <param name="flags"></param>
        /// <returns>目标结果集中元素数量</returns>
        long SetCombineAndStore(SetOperation operation, string destination, string[] keys, CommandFlags flags = CommandFlags.None);
        /// <summary>
        /// 此命令等于SetCombine，但不是返回结果集，而是存储在目标中。如果目标已存在，它将被覆盖。
        /// </summary>
        /// <param name="operation">操作方式 SetOperation：Union(并集)，Intersec(交集)，Differencet(不同)</param>
        /// <param name="destination">目标键</param>
        /// <param name="first">给定的第一个集合键</param>
        /// <param name="second">给定的第二个集合键</param>
        /// <param name="flags"></param>
        /// <returns>目标结果集中元素数量</returns>
        long SetCombineAndStore(SetOperation operation, string destination, string first, string second, CommandFlags flags = CommandFlags.None);
        //
        // 摘要: 
        //     Returns if member is a member of the set stored at key.
        //
        // 返回结果: 
        //     1 if the element is a member of the set. 0 if the element is not a member
        //     of the set, or if key does not exist.
        //
        // 备注: 
        //     http://redis.io/commands/sismember
        /// <summary>
        /// 判断值元素是否存在集合内
        /// 如果值是存储键的集合的成员，则返回。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <param name="flags"></param>
        /// <returns>1如果元素是集合成员.0如果元素不是集合成员，或者集合键就不存在</returns>
        bool SetContains<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class;
        //
        // 摘要: 
        //     Returns the set cardinality (number of elements) of the set stored at key.
        //
        // 返回结果: 
        //     the cardinality (number of elements) of the set, or 0 if key does not exist.
        //
        // 备注: 
        //     http://redis.io/commands/scard
        /// <summary>
        /// 返回存储键集合的成员数量
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>返回集合的成员数，或者如果键不存在返回0</returns>
        long SetLength(string key, CommandFlags flags = CommandFlags.None);
        //
        // 摘要: 
        //     Returns all the members of the set value stored at key.
        //
        // 返回结果: 
        //     all elements of the set.
        //
        // 备注: 
        //     http://redis.io/commands/smembers
        /// <summary>
        /// 返回存储键集合的所有值
        /// 返回在key存储的设置值的所有成员。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>集合所有成员</returns>
        List<T> SetMembers<T>(string key, CommandFlags flags = CommandFlags.None) where T : class;

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
        bool SetMove<T>(string source, string destination, T value, CommandFlags flags = CommandFlags.None) where T : class;
        //
        // 摘要: 
        //     Removes and returns a random element from the set value stored at key.
        //
        // 返回结果: 
        //     the removed element, or nil when key does not exist.
        //
        // 备注: 
        //     http://redis.io/commands/spop
        /// <summary>
        /// 从存储键设置值删除并返回一个随机元素
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>删除的元素，或者nil当键不存在的时</returns>
        T SetPop<T>(string key, CommandFlags flags = CommandFlags.None) where T : class;
        //
        // 摘要: 
        //     Return a random element from the set value stored at key.
        //
        // 返回结果: 
        //     the randomly selected element, or nil when key does not exist
        //
        // 备注: 
        //     http://redis.io/commands/srandmember
        /// <summary>
        /// 从存储键设置值中返回一个随机元素
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="flags"></param>
        /// <returns>随机选择的元素，或者nil当键不存在时</returns>
        T SetRandomMember<T>(string key, CommandFlags flags = CommandFlags.None) where T : class;
        //
        // 摘要: 
        //     Return an array of count distinct elements if count is positive. If called
        //     with a negative count the behavior changes and the command is allowed to
        //     return the same element multiple times.  In this case the numer of returned
        //     elements is the absolute value of the specified count.
        //
        // 返回结果: 
        //     an array of elements, or an empty array when key does not exist
        //
        // 备注: 
        //     http://redis.io/commands/srandmember
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
        List<T> SetRandomMembers<T>(string key, long count, CommandFlags flags = CommandFlags.None) where T : class;

        // 备注: 
        //     http://redis.io/commands/srem
        /// <summary>
        /// 从存储键集合中移除指定成员，如果此成员不是这个集合则忽略
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="value">移除对象值</param>
        /// <param name="flags"></param>
        /// <returns>如果此指定成员已经存在集合中返回True，否则False</returns>
        bool SetRemove<T>(string key, T value, CommandFlags flags = CommandFlags.None) where T : class;

        /// <summary>
        /// 批量移除
        /// 从存储键集合中移除指定成员(多个)，如果此成员不是集合成员则忽略。
        /// </summary>
        /// <typeparam name="T">设置类型</typeparam>
        /// <param name="key">键</param>
        /// <param name="values">移除的值</param>
        /// <param name="flags"></param>
        /// <returns>从集合中移除的成员数量，不包括非现有的成员</returns>
        long SetRemove<T>(string key, List<T> values, CommandFlags flags = CommandFlags.None) where T : class;

        #endregion

        //#region Redis Sort Set有序集合数据类型操作
        ////
        //// 摘要: 
        ////     Sorts a list, set or sorted set (numerically or alphabetically, ascending
        ////     by default); By default, the elements themselves are compared, but the values
        ////     can also be used to perform external key-lookups using the by parameter.
        ////     By default, the elements themselves are returned, but external key-lookups
        ////     (one or many) can be performed instead by specifying the get parameter (note
        ////     that # specifies the element itself, when used in get).  Referring to the
        ////     redis SORT documentation for examples is recommended. When used in hashes,
        ////     by and get can be used to specify fields using -> notation (again, refer
        ////     to redis documentation).
        ////
        //// 返回结果: 
        ////     Returns the sorted elements, or the external values if get is specified
        ////
        //// 备注: 
        ////     http://redis.io/commands/sort
        //RedisValue[] Sort(RedisKey key, long skip = 0, long take = -1, Order order = Order.Ascending, SortType sortType = SortType.Numeric, RedisValue by = null, RedisValue[] get = null, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Sorts a list, set or sorted set (numerically or alphabetically, ascending
        ////     by default); By default, the elements themselves are compared, but the values
        ////     can also be used to perform external key-lookups using the by parameter.
        ////     By default, the elements themselves are returned, but external key-lookups
        ////     (one or many) can be performed instead by specifying the get parameter (note
        ////     that # specifies the element itself, when used in get).  Referring to the
        ////     redis SORT documentation for examples is recommended. When used in hashes,
        ////     by and get can be used to specify fields using -> notation (again, refer
        ////     to redis documentation).
        ////
        //// 返回结果: 
        ////     Returns the number of elements stored in the new list
        ////
        //// 备注: 
        ////     http://redis.io/commands/sort
        //long SortAndStore(RedisKey destination, RedisKey key, long skip = 0, long take = -1, Order order = Order.Ascending, SortType sortType = SortType.Numeric, RedisValue by = null, RedisValue[] get = null, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Adds all the specified members with the specified scores to the sorted set
        ////     stored at key. If a specified member is already a member of the sorted set,
        ////     the score is updated and the element reinserted at the right position to
        ////     ensure the correct ordering.
        ////
        //// 返回结果: 
        ////     The number of elements added to the sorted sets, not including elements already
        ////     existing for which the score was updated.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zadd
        //long SortedSetAdd(RedisKey key, SortedSetEntry[] values, CommandFlags flags);
        ////
        //// 摘要: 
        ////     Adds the specified member with the specified score to the sorted set stored
        ////     at key. If the specified member is already a member of the sorted set, the
        ////     score is updated and the element reinserted at the right position to ensure
        ////     the correct ordering.
        ////
        //// 返回结果: 
        ////     True if the value was added, False if it already existed (the score is still
        ////     updated)
        ////
        //// 备注: 
        ////     http://redis.io/commands/zadd
        //bool SortedSetAdd(RedisKey key, RedisValue member, double score, CommandFlags flags);
        ////
        //// 摘要: 
        ////     Adds all the specified members with the specified scores to the sorted set
        ////     stored at key. If a specified member is already a member of the sorted set,
        ////     the score is updated and the element reinserted at the right position to
        ////     ensure the correct ordering.
        ////
        //// 返回结果: 
        ////     The number of elements added to the sorted sets, not including elements already
        ////     existing for which the score was updated.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zadd
        //long SortedSetAdd(RedisKey key, SortedSetEntry[] values, When when = When.Always, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Adds the specified member with the specified score to the sorted set stored
        ////     at key. If the specified member is already a member of the sorted set, the
        ////     score is updated and the element reinserted at the right position to ensure
        ////     the correct ordering.
        ////
        //// 返回结果: 
        ////     True if the value was added, False if it already existed (the score is still
        ////     updated)
        ////
        //// 备注: 
        ////     http://redis.io/commands/zadd
        //bool SortedSetAdd(RedisKey key, RedisValue member, double score, When when = When.Always, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Computes a set operation over two sorted sets, and stores the result in destination,
        ////     optionally performing a specific aggregation (defaults to sum)
        ////
        //// 返回结果: 
        ////     the number of elements in the resulting sorted set at destination
        ////
        //// 备注: 
        ////     http://redis.io/commands/zunionstore
        //long SortedSetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey first, RedisKey second, Aggregate aggregate = Aggregate.Sum, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Computes a set operation over multiple sorted sets (optionally using per-set
        ////     weights), and stores the result in destination, optionally performing a specific
        ////     aggregation (defaults to sum)
        ////
        //// 返回结果: 
        ////     the number of elements in the resulting sorted set at destination
        ////
        //// 备注: 
        ////     http://redis.io/commands/zunionstore
        //long SortedSetCombineAndStore(SetOperation operation, RedisKey destination, RedisKey[] keys, double[] weights = null, Aggregate aggregate = Aggregate.Sum, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Decrements the score of member in the sorted set stored at key by decrement.
        ////     If member does not exist in the sorted set, it is added with -decrement as
        ////     its score (as if its previous score was 0.0).
        ////
        //// 返回结果: 
        ////     the new score of member
        ////
        //// 备注: 
        ////     http://redis.io/commands/zincrby
        //double SortedSetDecrement(RedisKey key, RedisValue member, double value, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Increments the score of member in the sorted set stored at key by increment.
        ////     If member does not exist in the sorted set, it is added with increment as
        ////     its score (as if its previous score was 0.0).
        ////
        //// 返回结果: 
        ////     the new score of member
        ////
        //// 备注: 
        ////     http://redis.io/commands/zincrby
        //double SortedSetIncrement(RedisKey key, RedisValue member, double value, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the sorted set cardinality (number of elements) of the sorted set
        ////     stored at key.
        ////
        //// 返回结果: 
        ////     the cardinality (number of elements) of the sorted set, or 0 if key does
        ////     not exist.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zcard
        //long SortedSetLength(RedisKey key, double min = -1.0 / 0.0, double max = 1.0 / 0.0, Exclude exclude = Exclude.None, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     When all the elements in a sorted set are inserted with the same score, in
        ////     order to force lexicographical ordering, this command returns the number
        ////     of elements in the sorted set at key with a value between min and max.
        ////
        //// 返回结果: 
        ////     the number of elements in the specified score range.
        ////
        //// 备注: 
        ////     When all the elements in a sorted set are inserted with the same score, in
        ////     order to force lexicographical ordering, this command returns all the elements
        ////     in the sorted set at key with a value between min and max.
        //long SortedSetLengthByValue(RedisKey key, RedisValue min, RedisValue max, Exclude exclude = Exclude.None, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the specified range of elements in the sorted set stored at key.
        ////     By default the elements are considered to be ordered from the lowest to the
        ////     highest score. Lexicographical order is used for elements with equal score.
        ////      Both start and stop are zero-based indexes, where 0 is the first element,
        ////     1 is the next element and so on. They can also be negative numbers indicating
        ////     offsets from the end of the sorted set, with -1 being the last element of
        ////     the sorted set, -2 the penultimate element and so on.
        ////
        //// 返回结果: 
        ////     list of elements in the specified range
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrange
        //RedisValue[] SortedSetRangeByRank(RedisKey key, long start = 0, long stop = -1, Order order = Order.Ascending, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the specified range of elements in the sorted set stored at key.
        ////     By default the elements are considered to be ordered from the lowest to the
        ////     highest score. Lexicographical order is used for elements with equal score.
        ////      Both start and stop are zero-based indexes, where 0 is the first element,
        ////     1 is the next element and so on. They can also be negative numbers indicating
        ////     offsets from the end of the sorted set, with -1 being the last element of
        ////     the sorted set, -2 the penultimate element and so on.
        ////
        //// 返回结果: 
        ////     list of elements in the specified range
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrange
        //SortedSetEntry[] SortedSetRangeByRankWithScores(RedisKey key, long start = 0, long stop = -1, Order order = Order.Ascending, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the specified range of elements in the sorted set stored at key.
        ////     By default the elements are considered to be ordered from the lowest to the
        ////     highest score. Lexicographical order is used for elements with equal score.
        ////      Start and stop are used to specify the min and max range for score values.
        ////     Similar to other range methods the values are inclusive.
        ////
        //// 返回结果: 
        ////     list of elements in the specified score range
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrangebyscore
        //RedisValue[] SortedSetRangeByScore(RedisKey key, double start = -1.0 / 0.0, double stop = 1.0 / 0.0, Exclude exclude = Exclude.None, Order order = Order.Ascending, long skip = 0, long take = -1, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the specified range of elements in the sorted set stored at key.
        ////     By default the elements are considered to be ordered from the lowest to the
        ////     highest score. Lexicographical order is used for elements with equal score.
        ////      Start and stop are used to specify the min and max range for score values.
        ////     Similar to other range methods the values are inclusive.
        ////
        //// 返回结果: 
        ////     list of elements in the specified score range
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrangebyscore
        //SortedSetEntry[] SortedSetRangeByScoreWithScores(RedisKey key, double start = -1.0 / 0.0, double stop = 1.0 / 0.0, Exclude exclude = Exclude.None, Order order = Order.Ascending, long skip = 0, long take = -1, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     When all the elements in a sorted set are inserted with the same score, in
        ////     order to force lexicographical ordering, this command returns all the elements
        ////     in the sorted set at key with a value between min and max.
        ////
        //// 返回结果: 
        ////     list of elements in the specified score range.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrangebylex
        //RedisValue[] SortedSetRangeByValue(RedisKey key, RedisValue min = null, RedisValue max = null, Exclude exclude = Exclude.None, long skip = 0, long take = -1, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the rank of member in the sorted set stored at key, by default with
        ////     the scores ordered from low to high. The rank (or index) is 0-based, which
        ////     means that the member with the lowest score has rank 0.
        ////
        //// 返回结果: 
        ////     If member exists in the sorted set, the rank of member; If member does not
        ////     exist in the sorted set or key does not exist, null
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrank
        //long? SortedSetRank(RedisKey key, RedisValue member, Order order = Order.Ascending, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Removes the specified member from the sorted set stored at key. Non existing
        ////     members are ignored.
        ////
        //// 返回结果: 
        ////     True if the member existed in the sorted set and was removed; False otherwise.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrem
        //bool SortedSetRemove(RedisKey key, RedisValue member, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Removes the specified members from the sorted set stored at key. Non existing
        ////     members are ignored.
        ////
        //// 返回结果: 
        ////     The number of members removed from the sorted set, not including non existing
        ////     members.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zrem
        //long SortedSetRemove(RedisKey key, RedisValue[] members, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Removes all elements in the sorted set stored at key with rank between start
        ////     and stop. Both start and stop are 0 -based indexes with 0 being the element
        ////     with the lowest score. These indexes can be negative numbers, where they
        ////     indicate offsets starting at the element with the highest score. For example:
        ////     -1 is the element with the highest score, -2 the element with the second
        ////     highest score and so forth.
        ////
        //// 返回结果: 
        ////     the number of elements removed.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zremrangebyrank
        //long SortedSetRemoveRangeByRank(RedisKey key, long start, long stop, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Removes all elements in the sorted set stored at key with a score between
        ////     min and max (inclusive by default).
        ////
        //// 返回结果: 
        ////     the number of elements removed.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zremrangebyscore
        //long SortedSetRemoveRangeByScore(RedisKey key, double start, double stop, Exclude exclude = Exclude.None, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     When all the elements in a sorted set are inserted with the same score, in
        ////     order to force lexicographical ordering, this command removes all elements
        ////     in the sorted set stored at key between the lexicographical range specified
        ////     by min and max.
        ////
        //// 返回结果: 
        ////     the number of elements removed.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zremrangebylex
        //long SortedSetRemoveRangeByValue(RedisKey key, RedisValue min, RedisValue max, Exclude exclude = Exclude.None, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     The ZSCAN command is used to incrementally iterate over a sorted set
        ////
        //// 返回结果: 
        ////     yields all elements of the sorted set.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zscan
        //IEnumerable<SortedSetEntry> SortedSetScan(RedisKey key, RedisValue pattern, int pageSize, CommandFlags flags);
        ////
        //// 摘要: 
        ////     The ZSCAN command is used to incrementally iterate over a sorted set; note:
        ////     to resume an iteration via cursor, cast the original enumerable or enumerator
        ////     to IScanningCursor.
        ////
        //// 返回结果: 
        ////     yields all elements of the sorted set.
        ////
        //// 备注: 
        ////     http://redis.io/commands/zscan
        //IEnumerable<SortedSetEntry> SortedSetScan(RedisKey key, RedisValue pattern = null, int pageSize = 10, long cursor = 0, int pageOffset = 0, CommandFlags flags = CommandFlags.None);
        ////
        //// 摘要: 
        ////     Returns the score of member in the sorted set at key; If member does not
        ////     exist in the sorted set, or key does not exist, nil is returned.
        ////
        //// 返回结果: 
        ////     the score of member
        ////
        //// 备注: 
        ////     http://redis.io/commands/zscore
        //double? SortedSetScore(RedisKey key, RedisValue member, CommandFlags flags = CommandFlags.None);
        //#endregion

        #region Redis Hash散列数据类型操作

        /// <summary>
        /// Redis散列数据类型  批量新增
        /// </summary>
        void HashSet(string key, List<HashEntry> hashEntrys, CommandFlags flags = CommandFlags.None);

        /// <summary>
        /// Redis散列数据类型  新增一个
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="val"></param>
        void HashSet<T>(string key, string field, T val, When when = When.Always, CommandFlags flags = CommandFlags.None);

        /// <summary>
        ///  Redis散列数据类型 获取指定key的指定field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <returns></returns>
        T HashGet<T>(string key, string field);

        /// <summary>
        ///  Redis散列数据类型 获取所有field所有值,以 HashEntry[]形式返回
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        HashEntry[] HashGetAll(string key, CommandFlags flags = CommandFlags.None);

        /// <summary>
        /// Redis散列数据类型 获取key中所有field的值。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        List<T> HashGetAllValues<T>(string key, CommandFlags flags = CommandFlags.None);

        /// <summary>
        /// Redis散列数据类型 获取所有Key名称
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        string[] HashGetAllKeys(string key, CommandFlags flags = CommandFlags.None);

        /// <summary>
        ///  Redis散列数据类型  单个删除field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="hashField"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        bool HashDelete(string key, string hashField, CommandFlags flags = CommandFlags.None);

        /// <summary>
        ///  Redis散列数据类型  批量删除field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="hashFields"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        long HashDelete(string key, string[] hashFields, CommandFlags flags = CommandFlags.None);

        /// <summary>
        ///  Redis散列数据类型 判断指定键中是否存在此field
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        bool HashExists(string key, string field, CommandFlags flags = CommandFlags.None);

        /// <summary>
        /// Redis散列数据类型  获取指定key中field数量
        /// </summary>
        /// <param name="key"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        long HashLength(string key, CommandFlags flags = CommandFlags.None);

        /// <summary>
        /// Redis散列数据类型  为key中指定field增加incrVal值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="field"></param>
        /// <param name="incrVal"></param>
        /// <param name="flags"></param>
        /// <returns></returns>
        double HashIncrement(string key, string field, double incrVal, CommandFlags flags = CommandFlags.None);


        #endregion

        #region Redis各数据类型公用

        /// <summary>
        /// Redis中是否存在指定Key
        /// </summary>
        /// <param name="key"></param>
        /// <param name="commandFlags"></param>
        /// <returns></returns>
        bool KeyExists(string key, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// 从Redis中移除键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="commandFlags"></param>
        /// <returns></returns>
        bool KeyRemove(string key, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// 从Redis中移除多个键
        /// </summary>
        /// <param name="keys"></param>
        /// <param name="commandFlags"></param>
        /// <returns></returns>
        void KeyRemove(RedisKey[] keys, CommandFlags commandFlags = CommandFlags.None);

        /// <summary>
        /// Dispose DB connection 释放DB相关链接
        /// </summary>
        void DbConnectionStop();
        #endregion

        #region Redis简易消息队列使用list数据结构Push/Pop 生产者/消费者模式
        /// <summary>
        /// 消息队列 入列
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <param name="value">值</param>
        void EnqueueItemOnList(string listId, string value);
        /// <summary>
        /// 消息队列 出列
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <returns>值</returns>
        string DequeueItemFromList(string listId);
        /// <summary>
        /// 消息队列 入列 
        /// value泛型
        /// </summary>
        /// <param name="listId">队列key键</param>
        /// <param name="value">值</param>
        void EnqueueItemOnList<T>(string listId, T value) where T : class;
        /// <summary>
        /// 消息队列 出列 
        /// value泛型
        /// </summary>
        /// <param name="listId">队列键</param>
        /// <returns></returns>
        T DequeueItemFromList<T>(string listId) where T : class;
        #endregion
    }

}
