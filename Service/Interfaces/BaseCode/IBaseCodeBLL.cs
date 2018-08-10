using Common;

namespace Service.Interfaces.BaseCode
{
    public interface IBaseCodeBLL : IDependency
    {
        /// <summary>
        /// 根据页面url获取页面Ename
        /// </summary>
        /// <param name="url">页面url</param>
        /// <returns>Ename</returns>
        string GetEnameByUrl(string url);
        /// <summary>
        /// 判断登录用户名是否重复
        /// </summary>
        /// <param name="UserName">用户名或邮箱或手机号</param>
        /// <returns>ture/false</returns>
        bool GetJudgeUserName(string UserName);
        /// <summary>
        /// 判断EMAIL是否重复
        /// </summary>
        /// <param name="UserName">邮箱</param>
        /// <returns>ture/false</returns>
        bool GetJudgeEmail(string Email);
        /// <summary>
        /// 根据用户名，手机号，邮箱登录
        /// </summary>
        /// <param name="username">用户名或手机或 邮箱</param>
        /// <param name="pwd">密码</param>
        /// <returns>{result：'A' ,user: 'B'}</returns>
        object GetByUserPwdSave(string username, string pwd);
    }
}
