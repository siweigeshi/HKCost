using BLL.Interfaces.IBase;
using System.Collections.Generic;
using System;
using Domain.Core;
using System.Linq;
using DAL;
using BLL.Interfaces.IBusiness.ICore;
using Service.Interfaces.BaseCode;

namespace Service.Implements.BaseCode
{
    /// <summary>
    /// 通用的业务数据读取方法;基础码表数据读取
    /// 基础码表数据读取
    /// </summary>
    public class BaseCodeBLL :  IBaseCodeBLL
    {
        #region BLL的IoC映射
        private readonly IUserBLL _userBll;
        private readonly IReadWriteBLL<Base_ModuleInfo> _moduleInfoBll;//菜单
        public readonly IReadWriteBLL<Base_UserInfo> _userInfoBll;//用户表
        public BaseCodeBLL(IUserBLL userBll, IReadWriteBLL<Base_ModuleInfo> moduleInfoBll, 
            IReadWriteBLL<Base_UserInfo> userInfoBll)
        {
            _userBll = userBll;
            _moduleInfoBll = moduleInfoBll;
            _userInfoBll = userInfoBll;
        }
        #endregion

        #region IBaseCode 成员
        ///// <summary>
        ///// 用户注册
        ///// </summary>
        ///// <param name="position">职位表实体</param>
        ///// <returns>true:保存成功,false:保存失败</returns>
        //public bool PostPositionSave(Base_UserInfo base_User)
        //{
        //    if (string.IsNullOrEmpty(base_User.OID))
        //    {
        //        base_User.Name = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).OID;
        //        base_User.VDATETIME = DateTime.Now;
        //    }
        //    return this.
        //}
        /// <summary>
        /// 根据页面url获取页面Ename
        /// </summary>
        /// <param name="url">页面url</param>
        /// <returns>Ename</returns>
        public string GetEnameByUrl(string url)
        {
            string ref_ename = string.Empty;
            Base_ModuleInfo ModuleInfo = _moduleInfoBll.FindBy(o => o.PathHandler == url).FirstOrDefault();
            if (ModuleInfo != null)
            {
                ref_ename = ModuleInfo.EName;
            }
            return ref_ename;
        }
        /// <summary>
        /// 判断登录用户名是否重复
        /// </summary>
        /// <param name="UserName">用户名或邮箱或手机号</param>
        /// <returns>ture/false</returns>
        public bool GetJudgeUserName(string UserName)
        {
            bool res = SessionFactory.GetCurrentSession().QueryOver<Base_UserInfo>()
                .Where(t => (t.UserName == UserName  || t.EMAIL == UserName) && t.State == 0).RowCount() > 0;
            return res;
        }
        /// <summary>
        /// 判断EMAIL是否重复
        /// </summary>
        /// <param name="UserName">邮箱</param>
        /// <returns>ture/false</returns>
        public bool GetJudgeEmail(string Email)
        {
            bool res = SessionFactory.GetCurrentSession().QueryOver<Base_UserInfo>().
                Where(t => (t.EMAIL == Email || t.UserName == Email) && t.State == 0).RowCount() > 0;
            return res;
        }
        /// <summary>
        /// 生成随机码
        /// </summary>
        /// <param name="codeNum">随机码的长度</param>
        /// <returns>字符串</returns>
        private string VerifyCode(int codeNum)
        {
            int ranNum;
            char[] cArray = new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
            string checkCode = string.Empty;
            Random random2 = new Random();
            for (int i = 0; i < codeNum; i++)
            {
                ranNum = random2.Next(26);
                checkCode += cArray[ranNum];
            }
            return checkCode;
        }
        
        /// <summary>
        /// 根据用户名，手机号，邮箱登录
        /// </summary>
        /// <param name="username">用户名或手机或 邮箱</param>
        /// <param name="pwd">密码</param>
        /// <returns>{result：'A' ,user: 'B'}</returns>
        public object GetByUserPwdSave(string username, string pwd)
        {
            string result = "false";
            Base_UserInfo user = _userInfoBll.GetBy(o => (o.UserName == username || o.EMAIL == username) && o.State == 0);
            if (user == null)
                return Common.NewtonJsonHelper.Deserialize<object>("{'result':\"nouser\",'user':null}", null);
            if (user.UserPwd != pwd)
                return Common.NewtonJsonHelper.Deserialize<object>("{'result':\"pwderror\",'user':null}", null);
            string value = "{}";
            List<string> igorelist = new List<string>();
            igorelist.Add("Users");//过滤掉组织机构中的用户属性
            igorelist.Add("Modules");//过滤掉组织机构中的模块属性
            igorelist.Add("Roles");//过滤掉人员列表中的角色
            result = "true";
            value = Common.NewtonJsonHelper.Serialize(user, igorelist);
            Tools.SessionHelper.SaveSession(Tools.SessionHelper.SessinoName.CurUser, Common.NewtonJsonHelper.Deserialize<Base_UserInfo>(value, igorelist));
            string myresult = "{'result':" + result + ",'user':" + value + "}";
            return Common.NewtonJsonHelper.Deserialize<object>(myresult, null);

        }
        #endregion
    }
}
