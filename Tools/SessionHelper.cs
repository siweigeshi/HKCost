using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Tools
{
    /*
     * 封装为了增加项目对session的统一管理和可替换性
     * version:1.0
     */
    /// <summary>
    /// 操作session的类
    /// </summary>
    public class SessionHelper
    {
        /// <summary>
        /// 保存session方法
        /// <param name="name">session的名称(枚举类型)</param>
        /// <param name="obj">session的值</param>
        /// </summary>
        public static void SaveSession(SessinoName name, object obj)
        {
            HttpContext.Current.Session[name.ToString()] = obj;
        }
        /// <summary>
        /// 判断session是否存在
        /// </summary>
        /// <param name="name">session的名称(枚举类型)</param>
        /// <returns>true:已登陆，false:未登录</returns>
        public static bool JudgeSession(SessinoName name)
        {
            return HttpContext.Current.Session[name.ToString()] != null && 
                !string.IsNullOrEmpty(HttpContext.Current.Session[name.ToString()].ToString());
        }
        /// <summary>
        /// 获取session的值
        /// </summary>
        /// <typeparam name="T">泛型</typeparam>
        /// <param name="name">session的名称(枚举类型)</param>
        /// <returns></returns>
        public static T GetSession<T>(SessinoName name)
        {
            if (JudgeSession(name))
                return (T)HttpContext.Current.Session[name.ToString()];
            else
                return default(T);
        }
        /// <summary>
        /// 删除Session
        /// </summary>
        /// <param name="name">session的名称</param>
        /// <returns>true:删除成功,false:删除失败</returns>
        public static bool RemoveSession(SessinoName name)
        {
            if (HttpContext.Current != null && HttpContext.Current.Session != null 
                && !string.IsNullOrEmpty(Convert.ToString(HttpContext.Current.Session[name.ToString()])))
                HttpContext.Current.Session[name.ToString()] = null;
            return true;
        }
        /// <summary>
        /// 设置枚举类型统一管理session名称
        /// </summary>
        public enum SessinoName
        {
            CurUser//登陆用户
        }
    }
}
