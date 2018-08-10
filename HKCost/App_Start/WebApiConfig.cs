using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Routing;
using WebApiTest.Controllers.Handler;
using HKCost.App_Start;

namespace HKCost
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            // Web API configuration and services
            //定义返回格式为json
            //var json = config.Formatters.JsonFormatter;
            //json.SerializerSettings.PreserveReferencesHandling =
            //    Newtonsoft.Json.PreserveReferencesHandling.Objects;
            //config.Formatters.Remove(config.Formatters.XmlFormatter);
            //方法1
            //config.Formatters.Clear();
            //config.Formatters.Add(new JsonMediaTypeFormatter());
            /*方法2 实现始终返回json
             var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");  
             config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType); 
             方法3
             * config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();  
             * 方法4
             * config.Formatters.Remove(config.Formatters.XmlFormatter);  
             * 方法5 实现有url参数控制返回json或xml格式
             * 这样可以通过 /api/xxxx/id?ct=json来返回json格式 
             * config.Formatters.XmlFormatter.MediaTypeMappings.Add(new QueryStringMapping("ct", "xml", "application/xml"));  
              config.Formatters.JsonFormatter.MediaTypeMappings.Add(new QueryStringMapping("ct", "json", "application/json"));  
              方法6
             *             var json = config.Formatters.JsonFormatter; 
            json.SerializerSettings.PreserveReferencesHandling = 
                Newtonsoft.Json.PreserveReferencesHandling.Objects; 
 
            config.Formatters.Remove(config.Formatters.XmlFormatter);
             */





            config.Formatters.XmlFormatter.MediaTypeMappings.Add(new QueryStringMapping("ct", "xml", "application/xml"));
            config.Formatters.JsonFormatter.MediaTypeMappings.Add(new QueryStringMapping("ct", "json", "application/json"));

            // Web API routes
            config.MapHttpAttributeRoutes();

            RouteTable.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            ).RouteHandler = new SessionRouteHandler();  //创建Session

            //Autofac构造注入 [注册webapi和mvc容器]
            AutoFaconfig.Initialize(config);
        }
    }
}
