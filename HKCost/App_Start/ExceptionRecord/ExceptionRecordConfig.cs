using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace HKCost.App_Start.ExceptionRecord
{
    /// <summary>
    /// 注册异常记录
    /// </summary>
    public class ExceptionRecordConfig
    {
        public static string ExceptionRecord = System.Web.Configuration.WebConfigurationManager.AppSettings["ExceptionRecord"].ToLower();
        public static void RegisterExceptionRecord()
        {
            switch (ExceptionRecord)
            {
                case "true":                    
                    GlobalConfiguration.Configuration.Filters.Add(new WebApiExceptionFilterAttribute());//注册异常队列 生产者
                    ExceptionQueueConfig.RegisterExceptionQueue(ExceptionQueueConfig.ExceptionQueue);//注册异常队列 消费者
                    break;
                case "false":
                    GlobalConfiguration.Configuration.Filters.Add(new WebApiExceptionFilterAttribute());//注册异常队列 生产者
                    ExceptionQueueConfig.RegisterExceptionQueue(ExceptionQueueConfig.ExceptionQueue);//注册异常队列 消费者
                    break;
                default:
                    break;
            }            
        }
    }
}