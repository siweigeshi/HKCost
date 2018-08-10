using System;
using System.Collections.Generic;
using Domain;
using System.Web.Http.Filters;

namespace Tools
{
    /// <summary>
    /// 队列工厂 用于生产各种队列 在枚举加入队列泛型
    /// </summary>
    public class QueueFactory
    {
        public static Queue<Exception> ExceptionQueue;
        public static Queue<Message> MessageQueue;

        private static object _lock = new object();
        
        /// <summary>
        /// 队列工厂
        /// </summary>
        /// <param name="queueType"></param>
        /// <returns></returns>
        public static object CreateQueue(QueueType queueType)
        {
            lock (_lock)//多线程下避免错误
            {
                object queue = null;
                switch (queueType)
                {
                    case QueueType.Message:
                        if (MessageQueue == null)
                        {
                            MessageQueue = new Queue<Message>();
                            queue = MessageQueue;
                        }                            
                        else
                            queue = MessageQueue;
                        break;
                    case QueueType.Exception:
                        if (ExceptionQueue == null)
                        {
                            ExceptionQueue = new Queue<Exception>();
                            queue = ExceptionQueue;
                        }                            
                        else
                            queue = ExceptionQueue;
                        break;
                    //增加一个队列模型
                    default:
                        throw new Exception("wrong queueType");
                }
                return queue;
            }           
        }
        public enum QueueType
        {
            Message,
            Exception
        }
    }
}
