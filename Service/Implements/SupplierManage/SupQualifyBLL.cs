using BLL.Implements.Base;
using Common.QueryHelper;
using DAL.Implements.Base;
using Domain.Core;
using Service.Interfaces.SupplierManage;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Implements.SupplierManage
{
    public class SupQualifyBLL : BaseBLL<Base_UserInfo>, ISupQualifyBLL
    {
        public SupQualifyBLL(UnitOfWork uow) : base(uow) { }

        public object GetSupplierUser(int page, int limit, string swhere, string sort)
        {
            string userName = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).UserName;
            StringBuilder where = new StringBuilder();
            swhere = swhere != null ? swhere.Trim(',') + ",State|int|0|=" : "State|int|0|=";
            where.Append(swhere);
            //where.AppendFormat(",IsActive|0|0|or,IsActive|1|1|");
            where.AppendFormat(",IsActive|string|2|!=");
            PageParameter pagePara = new PageParameter()
            {
                PageIndex = page,
                Limit = limit,
                Swhere = where.ToString(),
                Sort = sort,
                ObjName = "userList",
                Igorelist = new List<string>() { "Orgs", "Roles", "Permissions" }
            };
            QueryParameter query = new QueryParameter("Base_UserInfo", pagePara.Swhere, pagePara, null);
            try
            {
                return this.GetAllPageList(query);
            }
            catch (Exception ee)
            {
                return "获取数据异常+"+ee;
            }
          
        }


    }

}
