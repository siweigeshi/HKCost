using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Tools
{
    public class GetCookie:Common.CommonClass.GetCookie
    {
        public static CookieCurUser GetCurUser()
        {
            CookieCurUser CurUser = new CookieCurUser();
            HttpCookie cookieCurUser = HttpContext.Current.Request.Cookies["CurUser"];
            if (cookieCurUser != null)
            {
                try
                {
                    string[] strsCurUser = Common.NewtonJsonHelper.Deserialize<string[]>(HttpUtility.UrlDecode(cookieCurUser.Value).ToString(), null);
                    CurUser.userId = strsCurUser[0];
                    CurUser.name = strsCurUser[1];
                    CurUser.defaultOrgId = strsCurUser[2];
                    CurUser.userName = strsCurUser[3];
                }
                catch (Exception ex)
                {

                }
            }
            return CurUser;
        }
    }
    public class CookieCurUser:Common.CommonClass.CookieCurUser
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string userName { get; set; }
    }
}
