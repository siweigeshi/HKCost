using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http.Filters;
using Tools;

namespace HKCost.App_Start.ExceptionRecord
{
    /// <summary>
    /// 全局异常捕获
    /// </summary>
    public class WebApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        /// <summary>
        /// 重写基类的异常处理方法
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            switch (ExceptionRecordConfig.ExceptionRecord)
            {
                //异常队列 异常入列 记录错误日志 跳转到自定义异常页面 生产环境使用
                case "true": ExceptionQueueConfig.ExceptionQueue.Enqueue(actionExecutedContext.Exception);
                    //if (actionExecutedContext.Exception is NotImplementedException)
                    //{
                    //    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.NotImplemented);
                    //}
                    //else if (actionExecutedContext.Exception is TimeoutException)
                    //{
                    //    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.RequestTimeout);
                    //}
                    ////这里可以根据项目需要返回到客户端特定的状态码。如果找不到相应的异常，统一返回服务端错误500
                    //else
                    //{
                    //    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    //}


                    //这里可以根据项目需要返回到客户端特定的状态码。如果找不到相应的异常，统一返回服务端错误500
                    actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                    break;
                //记录异常日志 直接把异常返回到当前页面 开发阶段使用   
                case "false": ExceptionQueueConfig.ExceptionQueue.Enqueue(actionExecutedContext.Exception);
                    break;
                //直接把异常返回到当前页面 不记录异常日志
                default:
                    break;
            }            
            base.OnException(actionExecutedContext);
        }
    }
}