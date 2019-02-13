using BLL.Interfaces.IBase;
using Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces.SupplierManage
{
    public interface ISupQualifyBLL :IReadWriteBLL<Base_UserInfo>
    {

        object GetSupplierUser(int page, int limit, string swhere, string sort);


    }
}
