using BLL.Interfaces.IBase;
using Domain.CostSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces.ParityManage
{
    public interface IDealOrderBLL : IReadWriteBLL<DealOrder>
    {
        /// <summary>
        ///获取交易单数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        object GetDealOrderList(int page, int limit, string swhere, string sort);
        /// <summary>
        /// 保存交易订单
        /// </summary>
        /// <param name="dealOrder"></param>
        /// <returns></returns>
        bool PostDealOrderSave(DealOrder dealOrder);


    }
}
