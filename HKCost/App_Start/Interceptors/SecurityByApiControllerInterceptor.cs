using Castle.DynamicProxy;
using Common.Exceptions;
using DAL;
using DAL.Implements.Base;
using System.Web;
using System.Web.Http.Controllers;
using HKCost.App_Start.Aspects;

namespace HKCost.App_Start.Interceptors
{
    /// <summary>
    /// 权限管理
    /// 通过AOP方式实现权限控制 拦截API Controller Session管理
    /// 加入事务拦截处理
    /// </summary>
    public class SecurityByApiControllerInterceptor : StandardInterceptor
    {
        private readonly AuthenticationAspect _authAspect;
        private readonly TransactionAspect _transAspect;
        public SecurityByApiControllerInterceptor (AuthenticationAspect authAspect, TransactionAspect transAspect)
        {
            _authAspect = authAspect;
            _transAspect = transAspect;
        }
        /// <summary>
        /// 在拦截的方法开始执行时候调用
        /// </summary>
        /// <param name="invocation"></param>
        protected override void PerformProceed (IInvocation invocation)
        {
            //System.Diagnostics.Trace.WriteLine("执行拦截器PerformProceed方法："+invocation.Method.Name.ToString());
            string methodName=invocation.Method.Name;
            if (methodName.Equals("Initialize")) //初始化 ApiController 实例
            {
                HttpControllerContext context=(HttpControllerContext)invocation.GetArgumentValue(0);
                string resultStr=string.Empty;//判断结果
                //if (!System.Diagnostics.Debugger.IsAttached)
                if (!_authAspect.IsAuthenticationByApi(context, out resultStr))   //权限验证是否通过
                {
                    if (resultStr=="noLogin")
                    {
                        throw new LoginException("noLogin");
                    }
                    else if (resultStr=="noAuth")
                    {
                        throw new PermissionLimittedException("noAuth");
                    }
                    //else if (resultStr == "sqlInjection")
                    //{
                    //    throw new SqlInjectionException("sqlInjection");
                    //}
                    else
                    {
                        throw new PermissionLimittedException("未知错误");
                    }
                }
                else   //验证通过之后根据请求的方法需要开启事务
                {
                    _transAspect.BeginTransaction(context);
                }

            }
            base.PerformProceed(invocation);
        }

        protected override void PostProceed (IInvocation invocation)
        {
            //System.Diagnostics.Trace.WriteLine("执行拦截器PostProceed方法："+invocation.Method.Name.ToString());
            if (invocation.Method.Name.Equals("ExecuteAsync")) //方法执行完成之后，需要提交事务.
            {
                HttpControllerContext context=  (HttpControllerContext)invocation.GetArgumentValue(0);
                _transAspect.CommitTransaction(context, invocation);
                SessionFactory.SessionUnbind();
            }
            base.PostProceed(invocation);
        }
    }
}