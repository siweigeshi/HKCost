using BLL.Interfaces.IBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.CostSystem;
namespace Service.Interfaces.ParityManage
{
    public interface IParityBLL:IReadWriteBLL<SupplierQuote>
    {
        /// <summary>
        /// 获取报价单数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        object GetQuoteList(int page, int limit, string swhere, string sort);


        /// <summary>
        /// 修改报价表状态
        /// </summary>
        /// <param name="supplierQuote"></param>
        /// <returns></returns>
        bool PostQuoteStatusSave(SupplierQuote supplierQuote);

       
    }
}
