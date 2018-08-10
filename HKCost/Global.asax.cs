using DAL;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using HKCost.App_Start.ExceptionRecord;
namespace HKCost
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            DBConnect.sessionContext = "web"; //web 方式 sessionContext
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            log4net.Config.XmlConfigurator.Configure();
            //注册异常记录
            ExceptionRecordConfig.RegisterExceptionRecord();
            
        }
        //protected void Session_End()
        //{
        //    RedisClient client = new RedisClient();
        //    EXH_SELECTFLOW selectFlow = (EXH_SELECTFLOW)Session["EXHSELECTBOOTH"];
        //    if (selectFlow!=null && selectFlow.BOOTHS!=null)
        //    {
        //        foreach (var item in selectFlow.BOOTHS)
        //        {
        //            try
        //            {
        //                client.SetRemove<string>("Booth:" + selectFlow.CFSCODE, item.BOOTHOID);
        //            }
        //            catch
        //            { }
        //        }
        //    }
        //}
    }
}
