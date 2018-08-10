using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;

namespace Tools
{
    public class JudgeSqlInjection
    {
        /// <summary>
        /// 验证url 
        /// </summary>
        /// <returns></returns>
        public static bool JudgeByUrl(HttpControllerContext context)
        {
            bool res = true;
            HttpMethodType method = (HttpMethodType)Enum.Parse(typeof(HttpMethodType), context.Request.Method.ToString());
            switch (method)
            {
                #region get方式
                case HttpMethodType.GET:
                    res=JudgeSqlInjectionByGetMethod(context);
                    break;
                #endregion

                #region post方式
                case HttpMethodType.POST:
                    res=JudgeSqlInjectionByPostMethod(context);
                    break;
                #endregion

                #region 其他方式
                default:
                    break;
                #endregion
            }
            return res;
        }
        /// <summary>
        /// 验证get方法url中的参数 
        /// </summary>
        /// <param name="context"></param>
        /// <returns>true 安全 false 不安全</returns>
        private static bool JudgeSqlInjectionByGetMethod(HttpControllerContext context)
        {
            bool res = true;
            HttpContextBase contextBase = (HttpContextBase)context.Request.Properties["MS_HttpContext"];//获取传统context
            //HttpRequestBase request = context1.Request;//定义传统request对象
            NameValueCollection uriParameters = contextBase.Request.QueryString;//获取get参数
            foreach (string key in uriParameters.Keys)
            {
                //Console.WriteLine("{0}:{1}", key, uriParameters[key]);
                //res = res && Common.Tools.IsSafeSqlString(uriParameters[key]);//判断参数是否符合 sql安全
            }
            return res;
        }
        /// <summary>
        /// 验证post数据
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private static bool JudgeSqlInjectionByPostMethod(HttpControllerContext context)
        {
            bool res = true;
            var reqData = context.Request.Content.ReadAsStringAsync().Result;//获取post参数
            dynamic model = Common.NewtonJsonHelper.Deserialize<dynamic>(reqData.ToString(), null);
            //foreach (var item in model)
            //{
                
            //}
            //foreach (var property in (IDictionary<String, Object>)model)
            //{
            //    object value=property.Value;
            //    //res = res && Common.Tools.IsSafeSqlString(property.Value); 
            //}
            //System.Reflection.PropertyInfo[] properties = model.GetType().GetProperties();
            //foreach (System.Reflection.PropertyInfo item in properties)
            //{
            //    string value = item.GetValue(model, null).ToString();
            //    res = res && Common.Tools.IsSafeSqlString(value);                
            //}
            //#region post数据为数组
            //if (reqData.ToString().StartsWith("["))
            //{
            //    string[] reqArray = reqData.ToString().Split(',');
            //    for (int i = 0; i < reqArray.Length; i++)
            //    {
            //        string[] reqArrayJson = reqArray[i].Split(',');
            //        for (int j = 1; j < reqArrayJson.Length; j += 2)
            //        {
            //            res = res && Common.Tools.IsSafeSqlString(reqArrayJson[j]);//判断参数是否符合 sql安全
            //        }
            //    }
            //}
            //#endregion

            //#region post数据为对象
            //else
            //{
            //    string[] reqJson = reqData.ToString().Split(',');
            //    for (int k = 0; k < reqJson.Length; k ++)
            //    {
            //        string[] strJsonItem=reqJson[k].Split(':');
            //        res = res && Common.Tools.IsSafeSqlString(strJsonItem[1]);//判断参数是否符合 sql安全
            //    }
            //}
            
            //#endregion    

            return res;
        }

        enum HttpMethodType
        {
            GET,
            POST,
            PUT,
            DELETE,
            HEAD,
            OPTIONS
        }
    }
}
