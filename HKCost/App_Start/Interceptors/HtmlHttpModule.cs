using Common;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace HKCost
{
    public class HtmlHttpModule : IHttpModule, IHttpHandler
    {


        public void Dispose()
        {

        }
        public void ProcessRequest(HttpContext context)
        {
            string requestDomain = context.Request.Url.Authority.ToLower(); //获得当前域名(含端口号)
            string requestPath = context.Request.Path.ToLower(); //获得当前页面(含目录)
            string filePath = context.Request.FilePath;//获取文件的路径
            string fileExtension = VirtualPathUtility.GetExtension(filePath);//获取文件扩展名
            string fileName = VirtualPathUtility.GetFileName(filePath).ToLower();//获取文件名
            NameValueCollection urlParams = context.Request.QueryString;
            string get_urlParams = string.Empty;
            foreach (string oneParamName in urlParams.AllKeys)
            {
                get_urlParams += oneParamName + "=" + urlParams[oneParamName].ToString() + "&";
            }
            if (urlParams.Count > 0)
            {
                get_urlParams = get_urlParams.Substring(0, get_urlParams.Length - 1);
                get_urlParams = "?" + get_urlParams;
                //requestPath += get_urlParams;
            }
            HttpCookie cookie = HttpContext.Current.Request.Cookies["CurUser"];

            if (System.IO.File.Exists(context.Server.MapPath(filePath)))
            {
                if ((filePath.ToLower().Substring(18, filePath.Length - 18).IndexOf("/") >= 0 || filePath.ToLower().Substring(18, filePath.Length - 18).IndexOf("\\") >= 0) &&
                    (filePath.ToLower().IndexOf("/areas/zzicec/web/repwd") < 0 && filePath.ToLower().IndexOf("/areas/zzicec/web/presign") < 0))
                {
                    //登录控制
                    if (string.IsNullOrEmpty(Common.CommonClass.GetCookie.GetCurUser().userId))
                    {
                        context.Response.Redirect("/areas/zzicec/web/login.html?reurl=" + requestPath + get_urlParams);
                    }
                    else
                    {
                        cookie.Expires = DateTime.Now.AddMinutes(120);
                        context.Response.Cookies.Add(cookie);
                        //权限控制
                        Tools.CookieCurUser CookieCurUser = Tools.GetCookie.GetCurUser();
                        int state = IsAllowByHtmlUrl(CookieCurUser.userId, CookieCurUser.defaultOrgId, requestPath);
                        if (state == 0) //没有请求权限
                        {
                            context.Response.Redirect("/areas/zzicec/web/noAuth.html");
                        }
                        else if (state == 2)
                        {
                            context.Response.Redirect("/areas/zzicec/web/login.html?reurl=" + requestPath + get_urlParams);
                        }
                        else
                        {
                            //pjax判断
                            bool bb = false;
                            try
                            {
                                bb = bool.Parse(context.Request.Params["pjax"]);
                            }
                            catch
                            {

                            }
                            if (bb && File.Exists(context.Server.MapPath(filePath.Substring(0, filePath.IndexOf('.')) + "Pjax.html")))
                            {
                                context.Response.WriteFile(context.Server.MapPath(filePath.Substring(0, filePath.IndexOf('.')) + "Pjax.html"));
                                context.Response.End();
                            }
                            else
                            {
                                context.Response.WriteFile(context.Server.MapPath(filePath));
                                context.Response.End();
                            }
                        }
                    }
                }
                else
                {
                    context.Response.WriteFile(context.Server.MapPath(filePath));
                    context.Response.End();
                }
            }
            else
            {
                context.Response.Redirect("/areas/zzicec/web/404.html");
            }
        }
        public bool IsReusable
        {
            get { return true; }
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(context_BeginRequest);
            context.EndRequest += new EventHandler(context_EndRequest);
        }

        void context_EndRequest(object sender, EventArgs e)
        {
            HttpApplication application = (HttpApplication)sender;
            HttpContext context = application.Context;
            string filePath = context.Request.FilePath;
            string fileExtension = VirtualPathUtility.GetExtension(filePath);
            if (fileExtension.Equals(".html") || fileExtension.Equals(".htm"))
            {
                //判断缓存是否存在，不存在加入缓存，调用生成静态的类和方法  
                //产品过期，移除静态文件，302重定向  
                if (System.IO.File.Exists(context.Server.MapPath(filePath)))
                {
                    context.Response.WriteFile(context.Server.MapPath(filePath));
                    context.Response.End();
                }
            }
        }

        void context_BeginRequest(object sender, EventArgs e)
        {
            //HttpApplication application = (HttpApplication)sender;
            //HttpContext context = application.Context;
            //string requestDomain = context.Request.Url.Authority.ToLower(); //获得当前域名(含端口号)
            //string requestPath = context.Request.Path.ToLower(); //获得当前页面(含目录)
            //string filePath = context.Request.FilePath;
            //string fileExtension = VirtualPathUtility.GetExtension(filePath);
            //if (fileExtension.Equals(".html") || fileExtension.Equals(".htm"))
            //{
            //}

        }
        /// <summary>
        /// 判断htmlUrl是否可访问
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="orgId">当前组织机构id</param>
        /// <param name="htmlUrl">访问html路径</param>
        /// <returns>1：可访问；0：不可访问；2：服务器缓存不存在或者是会话失效；-1：未知</returns>

        private int IsAllowByHtmlUrl(string userId, string orgId, string htmlUrl)
        {
            List<string> htmlUrls;
            string cachKey = userId + orgId + "_UserAuthHtmlUrl";

            #region 缓存是否存在，存在取出
            //判断缓存是否存在
            object info = CacheHelper.GetLocalCache(cachKey);
            //存在的话，从缓存中取出
            if (info != null)
            {
                htmlUrls = (List<string>)info;
            }
            //缓存不存在
            else
            {
                return 2;
            }
            #endregion
            //判断用户是否登陆或者会话是否失效
            if (string.IsNullOrEmpty(Common.CommonClass.GetCookie.GetCurUser().userId))
            {
                return 2;
            }
            if (htmlUrls != null & htmlUrls.Count > 0)
            {
                if (htmlUrls.Contains(htmlUrl.Trim().ToLower()))
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            return -1;
        }
    }
}
