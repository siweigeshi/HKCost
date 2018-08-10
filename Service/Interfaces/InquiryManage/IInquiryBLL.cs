using BLL.Interfaces.IBase;
using Domain.CostSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interfaces.InquiryManage
{
    public interface IInquiryBLL: IReadWriteBLL<BuyInquiry>
    {
        /// <summary>
        /// 获取询价表信息
        /// </summary>
        /// <param name="page">页数</param>
        /// <param name="limit">每页显示的条数</param>
        /// <param name="swhere">搜索条件</param>
        /// <param name="sort">排序条件</param>
        /// <returns></returns>
        object GetInquiryList(int page, int limit, string swhere, string sort);
        /// <summary>
        /// 假删除
        /// </summary>
        /// <param name="OIDs"></param>
        /// <returns></returns>
        bool PostInquiryDelete(string OIDs);
        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="buyInquiry"></param>
        /// <returns></returns>
        bool PostInquirySave(BuyInquiry buyInquiry);
    }
}
