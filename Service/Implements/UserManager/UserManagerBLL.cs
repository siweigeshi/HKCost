using BLL.Implements.Base;
using DAL.Implements.Base;
using Domain.Core;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Service.Implements.UserManager
{
    public class UserManagerBLL : BaseBLL<Base_UserInfo>, IUserManagerBLL
    {
        public UserManagerBLL(UnitOfWork _uow)
            : base(_uow)
        { }
        /// <summary>
        /// 获得登录名
        /// </summary>
        /// <returns></returns>
        public object GetUserName()
        {
            string userName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            return userName;
        }
    }
}
