using CacheLayer;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Web.Http.Filters;

namespace HKCost.App_Start.ExceptionRecord
{
    public class ExceptionQueueConfig
    {
        public static Queue<Exception> ExceptionQueue;
        static ExceptionQueueConfig()
        {
            ExceptionQueue = (Queue<Exception>)Common.QueueFactory.CreateQueue(Common.QueueFactory.QueueType.Exception);
        }
        /// <summary>
        /// 异常队列 消费者
        /// </summary>
        /// <param name="ExceptionQueue"></param>
        public static void RegisterExceptionQueue(Queue<Exception> ExceptionQueue)
        {
            ThreadPool.QueueUserWorkItem(o =>
            {
                while (true)
                {
                    long count = ExceptionQueue.Count;
                    if (count > 0)
                    {
                        Exception e = ExceptionQueue.Dequeue();//出列
                        StringBuilder msg = new StringBuilder();
                        msg.Append(e.Message);
                        Common.LogHelper.WriteLog(msg.ToString(), e);//异常信息写入日志
                    }
                    else
                    {
                        Thread.Sleep(1000); //为避免CPU空转，在队列为空时休息1秒
                    }
                }
            });
        }
    }
}