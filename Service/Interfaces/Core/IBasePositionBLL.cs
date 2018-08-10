using BLL.Interfaces.IBase;
using Common.CommonClass;
using Domain.Core;

namespace Service.Interfaces.Core
{
    public interface IBasePositionBLL:IReadWriteBLL<Base_Position>
    {
        /// <summary>
        /// 获取职位码表信息
        /// </summary>
        /// <param name="page">页数</param>
        /// <param name="limit">每页显示的条数</param>
        /// <param name="swhere">搜索条件</param>
        /// <param name="sort">排序条件</param>
        /// <returns></returns>
        object GetPositionList(int page, int limit, string swhere, string sort);
        /// <summary>
        /// 职位表保存事件
        /// </summary>
        /// <param name="position">职位表实体</param>
        /// <returns>true:保存成功,false:保存失败</returns>
        bool PostPositionSave(Base_Position position);
        /// <summary>
        /// 批量删除事件
        /// </summary>
        /// <param name="PostClass">OID的集合</param>
        /// <returns>true:删除成功,false:删除失败</returns>
        bool PostPositionDelete(PostClass PostClass);
        /// <summary>
        /// 判断Code是否已存在
        /// </summary>
        /// <param name="OID"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        bool GetJudgeByCode(string OID, string code);
    }
}
