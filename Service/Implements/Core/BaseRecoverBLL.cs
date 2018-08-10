﻿using BLL.Implements.Base;
using DAL;
using DAL.Implements.Base;
using Domain.Core;
using Service.Interfaces.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tools;

namespace Service.Implements.Core
{
    public class BaseRecoverBLL : BaseBLL<Base_UserInfo>, IBaseRecoverBLL
    {
        public BaseRecoverBLL(UnitOfWork _uow)
            : base(_uow)
        { }

        //public bool GetEmailUpdate(string email)
        //{
        //    Base_UserInfo data =  SessionFactory.GetCurrentSession().QueryOver<Base_UserInfo>()
        //        .Where(t => t.EMAIL == email).List<Base_UserInfo>().FirstOrDefault();
        //    if (data == null) return false;
        //    data.VCODE = SendEmail.getCaptcha(6);
        //    data.VDATETIME = DateTime.Now.AddMinutes(10);
        //    this.Update(data);
        //    //发送邮件
        //    SendEmail.sendEmail(email, data.VCODE);
        //    return true;
        //}

        public string PostCheckCaptcha(string captcha, string email)
        {
            Base_UserInfo data = SessionFactory.GetCurrentSession().QueryOver<Base_UserInfo>()
                .Where(t => t.EMAIL == email).List<Base_UserInfo>().FirstOrDefault();
            if (data == null) return "email";

            if (data.VCODE != captcha) return "captcha";
            if(data.VDATETIME < DateTime.Now) return "date";
            return data.OID;
        }
        public bool PostResetPwdUpdate(string OID, string newPwd, string captcha)
        {

            Base_UserInfo data = SessionFactory.GetCurrentSession().QueryOver<Base_UserInfo>()
                .Where(t => t.OID == OID).List<Base_UserInfo>().FirstOrDefault();
            data.UserPwd = newPwd;
            if (data.VCODE == captcha)
            {
                return this.Update(data);
            }
            return false;
        }
        
        
    }
}