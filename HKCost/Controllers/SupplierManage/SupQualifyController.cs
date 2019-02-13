using Service.Interfaces.SupplierManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HKCost.Controllers.SupplierManage
{
    /// <summary>
    /// 资质管理控制器
    /// </summary>
    public class SupQualifyController : ApiController
    {
        private readonly ISupQualifyBLL _supQualifyBLL;
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="supQualifyBLL"></param>
        public SupQualifyController(ISupQualifyBLL supQualifyBLL)
        {
            _supQualifyBLL = supQualifyBLL;
        }

        /// <summary>
        /// 获取用户是否激活信息
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public object GetSupplierUser(int page, int limit, string swhere, string sort)
        {
            return _supQualifyBLL.GetSupplierUser(page,limit,swhere,sort);
        }

    }
}
