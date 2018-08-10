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
        bool PostQuoteSave(SupplierQuote supplierQuote);

        object GetQuoteListswhere(string swhere);
    }
}
