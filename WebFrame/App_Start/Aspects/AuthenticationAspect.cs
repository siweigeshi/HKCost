using BLL.Interfaces.IBusiness.IAuth;
using Common;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;
using System.Web.Mvc;

namespace WebFrame.App_Start.Aspects
{
    /// <summary>
    ///权限认证业务面
    ///AOP面向切面方式
    /// </summary>
    public class AuthenticationAspect
    {

        private readonly IAuthenticationBLL _authBll;

        public AuthenticationAspect (IAuthenticationBLL authBll)
        {

            _authBll = authBll;
        }

        /// <summary>
        /// 是否拥有访问权限
        /// 应用于Web Api Controller
        /// </summary>
        /// <returns>布尔型</returns>
        public bool IsAuthenticationByApi (HttpControllerContext context, out string resultStr)
        {
            resultStr = string.Empty;
            bool op = true;

            #region 获取route信息 ControllerName and ActionName
            IDictionary<string, object> rds = context.RouteData.Values;//获取route信息
            string controller = string.Empty;//控制器名称
            string action = string.Empty;//action方法名
            string routeuri = string.Empty;
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
                if (routeuri.Length>1)
                    controller=routeuri.Split('/')[1];
            }
            #endregion

            #region 排除登陆Url请求拦截
            if (controller.ToLower()=="base"||controller.ToLower().StartsWith("base"))
            {
                return op;
            }
            #endregion

            #region 判断用户是否登陆
            //判断用户是否登陆
            if (HttpContext.Current.Request.Cookies["CurUser"] == null) //判断用户是否登陆
            {
                resultStr = "noLogin";
                op = false;
            }
            #endregion

            #region 判断请求url权限
            else //判断url权限
            {
                if (controller.ToLower() != "base")//排除controller为BaseController
                {
                    Uri uri = context.Request.RequestUri;//Uri对象
                    string path = uri.AbsolutePath;//获取请求uri的绝对路径
                    string[] segment = uri.Segments;//获取以‘/’分隔的路径数组
                    string url = path;//请求的url
                    string userId = string.Empty;//"6AF4A686-0144-4615-B0F5-06C43E5C3BC5";//string.Empty;
                    string orgId = string.Empty;//"994B6FEF-C194-4A43-971C-DC6411143BA3";//string.Empty;
                    string users = HttpContext.Current.Request.Cookies["CurUser"].Value;//获取Cookie信息
                    Console.Write(users);
                    users = HttpUtility.UrlDecode(users);
                    string[] value = users.Substring(1, users.Length - 2).Split(',');
                    userId = value[0].ToString().Replace("\"", "");
                    orgId = value[2].ToString().Replace("\"", "");
                    //判断用户权限
                    if (!IsAllowByActionUrl(userId, orgId, url))
                    {
                        resultStr = "noAuth";
                        op = false;
                    }
                }

            }
            #endregion

            return op;
        }


        /// <summary>
        /// 是否拥有访问权限
        /// 应用于Web Mvc Controller
        /// </summary>
        /// <returns>布尔型</returns>
        public bool IsAuthenticationByMvc (ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity.IsAuthenticated) //判断用户是否登陆
            {
                string controllerName = filterContext.RouteData.Values["controller"].ToString();

                string actionName = filterContext.RouteData.Values["action"].ToString();
            }

            return true;
        }
        /// <summary>
        /// 根据用户信息判断是否允许访问URL
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="orgId">组织机构id</param>
        /// <param name="url">路径</param>
        /// <returns>是否允许</returns>
        private bool IsAllowByActionUrl (string userId, string orgId, string url)
        {

            List<string> urls;
            string cachKey = userId + orgId + "_UserAuthUrl";

            #region 缓存是否存在，存在取出
            //判断缓存是否存在
            object info = CacheHelper.GetLocalCache(cachKey);
            //存在的话，从缓存中取出
            if (info != null)
            {
                urls = (List<string>)info;
            }
            #endregion

            #region 缓存不存在,存入创建缓存
            else
            {
                //不存在，存入缓存
                urls = _authBll.GetAllowUrlByUser(userId, orgId);
                CacheHelper.SaveLocalCache(null, TimeSpan.FromHours(_authBll.CacheHour), urls, cachKey);
            }
            #endregion

            if (urls != null & urls.Count > 0)
            {
                if (urls.Contains(url.Trim().ToLower()))
                {
                    return true;
                }
            }
            return false;
        }

    }
}