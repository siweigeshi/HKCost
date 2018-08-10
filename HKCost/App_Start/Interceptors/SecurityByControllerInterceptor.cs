using Castle.DynamicProxy;
using System.Web;
using System.Web.Mvc;
using HKCost.App_Start.Aspects;

namespace HKCost.App_Start.Interceptors
{
    /// <summary>
    /// 权限管理
    /// 通过AOP方式实现权限控制 拦截MVC Controller
    /// </summary>
    public class SecurityByControllerInterceptor : StandardInterceptor
    {
        private AuthenticationAspect _authAspect;
        public SecurityByControllerInterceptor(AuthenticationAspect authAspect)
        {
            _authAspect = authAspect;
        }
        /// <summary>
        /// 在拦截的方法开始执行时候调用
        /// </summary>
        /// <param name="invocation"></param>
        protected override void PerformProceed(IInvocation invocation)
        {
            if (invocation.Method.Name.Equals("OnActionExecuting"))
            {
                ActionExecutingContext filterContext = (ActionExecutingContext)invocation.GetArgumentValue(0);


                if (!_authAspect.IsAuthenticationByMvc(filterContext))
                {
                    HttpContext.Current.Response.Redirect("", true);//权限认证不通过，跳转到指定页面.
                    return;
                }
            }

            base.PerformProceed(invocation);
        }
    }
}