using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BLL.Interfaces.IBase;
using Domain.Core;

namespace Service.Interfaces
{
    public interface IUserManagerBLL : IReadWriteBLL<Base_UserInfo>
    {
       object GetUserName();
    }
}
