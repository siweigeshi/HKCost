using Castle.DynamicProxy;
using Common;
using DAL;
using DAL.Implements.Base;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;

namespace HKCost.App_Start.Aspects
{
    /// <summary>
    /// 事务业务面
    ///AOP面向切面方式
    /// </summary>
    public class TransactionAspect
    {
        private ITransaction Transaction;

        /// <summary>
        /// 开启事务
        /// </summary>
        /// <param name="invocation"></param>
        public void BeginTransaction(HttpControllerContext context)
        {
            //HttpCookie cookie = new HttpCookie("testStartTime", DateTime.Now.Ticks.ToString());//获取用户的用户名
            //cookie.Expires = DateTime.Now.AddMinutes(30);//设置cookie过期时间为30分钟后
            //HttpContext.Current.Response.Cookies.Add(cookie);//将cookie写入客户端
            string methodName = GetActionName(context);
            if (methodName.Contains("Save") || methodName.EndsWith("Add") || methodName.EndsWith("Update") || methodName.EndsWith("Delete"))
            {
                this.BeginTransaction();
            }
        }
        /// <summary>
        /// 提交事务
        /// </summary>
        /// <param name="invocation"></param>
        /// <returns></returns>
        public void CommitTransaction(HttpControllerContext context, IInvocation invocation)
        {
            string methodName = GetActionName(context);
            if (methodName.Contains("Save") || methodName.EndsWith("Add") || methodName.EndsWith("Update") || methodName.EndsWith("Delete"))
            {
                try
                {
                    this.Commit();
                }
                catch (Exception ex)
                {
                    //记录错误日志
                    IDictionary<string, object> rds = context.RouteData.Values;//获取route信息
                    string controller = rds["controller"].ToString();
                    string action = rds["action"].ToString();
                    LogHelper.WriteLog(string.Format("请求{0}控制器方法：{1},出错了！", controller, action), ex);
                    //执行方法返回值为false 执行失败
                    if (invocation.ReturnValue.GetType() == typeof(bool))
                    {
                        invocation.ReturnValue = false;
                    }
                    this.Rollback();
                }
                finally
                {
                    this.EndTransaction();
                }

            }
            //HttpCookie cookie = new HttpCookie("testEndTime", DateTime.Now.Ticks.ToString());//获取用户的用户名
            //cookie.Expires = DateTime.Now.AddMinutes(30);//设置cookie过期时间为30分钟后
            //HttpContext.Current.Response.Cookies.Add(cookie);//将cookie写入客户端
            //SessionFactory.SessionUnbind();
        }

        public string GetActionName(HttpControllerContext context)
        {
            #region 获取route信息 ControllerName and ActionName
            IDictionary<string, object> rds = context.RouteData.Values;//获取route信息
            string controller = string.Empty;//控制器名称
            string action = string.Empty;//action方法名
            string routeuri = string.Empty;
            if (rds.Count > 0)
            {

                if (rds["controller"] != null)
                {
                    controller = rds["controller"].ToString();
                    action = rds["action"].ToString();
                }
                else //自定义route 获取route uri
                {
                    foreach (var item in rds)
                    {
                        routeuri = ((((IHttpRouteData[])(item.Value))[0]).Route).RouteTemplate;
                    }
                    if (routeuri.Length > 1)
                        controller = routeuri.Split('/')[1];
                    action = routeuri.Split('/')[2];
                }

            }
            return action;
            #endregion
        }


        #region 事务处理
        public ITransaction BeginTransaction()
        {
            if (Transaction == null)
            {
                Transaction = SessionFactory.GetCurrentSession().BeginTransaction(IsolationLevel.ReadCommitted);
            }
            #region old code
            //if (Transaction != null)
            //{
            //    //throw new InvalidOperationException("一个Session中不能开启多个事务！");
            //}
            // Transaction = SessionFactory.GetCurrentSession().BeginTransaction(IsolationLevel.ReadCommitted);      
            #endregion
            return Transaction;
        }

        public void Commit()
        {
            if (!Transaction.IsActive)
            {
                throw new InvalidOperationException("不能提交未激活的事务！");
            }
            Transaction.Commit();
        }

        public void Rollback()
        {
            if (Transaction.IsActive)
            {
                Transaction.Rollback();
            }
        }

        public void EndTransaction()
        {
            if (Transaction != null)
            {
                Transaction.Dispose();
            }
        }
        #endregion
    }
}