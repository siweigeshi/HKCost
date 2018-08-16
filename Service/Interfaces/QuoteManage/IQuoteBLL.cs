using BLL.Interfaces.IBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.CostSystem;

namespace Service.Interfaces.QuoteManage
{
    public interface IQuoteBLL:IReadWriteBLL<SupplierQuote>
    {
        object GetQuoteList(int page, int limit, string swhere, string sort);
        /// <summary>
        /// 获取报价表报价成功的数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        object GetQuoteResultList(int page, int limit, string swhere, string sort);
        bool PostQuoteSave(SupplierQuote supplierQuote);

        object GetQuoteListswhere(string swhere);
    }
}
