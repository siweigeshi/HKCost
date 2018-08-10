using BLL.Interfaces.IBase;
using Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces.Core
{
    public interface IBaseRecoverBLL:IReadWriteBLL<Base_UserInfo>
    {
        //bool GetEmailUpdate(string email);
        string PostCheckCaptcha(string captcha, string email);
        bool PostResetPwdUpdate(string OID, string newPwd, string captcha);
    }
}
