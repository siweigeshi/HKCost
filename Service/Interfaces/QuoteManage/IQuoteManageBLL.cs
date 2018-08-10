using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BLL.Interfaces.IBase;
using Common.CommonClass;
using Domain.CostSystem;

namespace Service.Interfaces.QuoteManage
{
    public interface IQuoteManageBLL:IReadWriteBLL<SupplierQuote>
    {
        /// <summary>
        /// 获取报价单管理中的数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        object GetQuoteManageList(int page, int limit, string swhere, string sort);


        /// <summary>
        /// 通过标题来寻找当前询价单
        /// </summary>
        /// <param name="swhere"></param>
        /// <returns></returns>
        object GetQuoteManageListswhere(string swhere);


        /// <summary>
        /// 报价单删除
        /// </summary>
        /// <param name="postClass"></param>
        /// <returns></returns>
        bool PostQuoteDelete(string OIDs);

         
    }
}
