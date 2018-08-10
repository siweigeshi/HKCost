using Common.CommonClass;
using Domain.Core;
using Service.Interfaces.Core;
using System.Web.Http;

namespace HKCost.Controllers.Core
{
    public class BasePositionController : ApiController
    {
        private readonly IBasePositionBLL _basePositionBll;
        public BasePositionController(IBasePositionBLL BasePositionBll)
        {
            _basePositionBll = BasePositionBll;
        }
        #region 业务方法
        /// <summary>
        /// 获取职位码表信息
        /// </summary>
        /// <param name="page">页数</param>
        /// <param name="limit">每页显示的条数</param>
        /// <param name="swhere">搜索条件</param>
        /// <param name="sort">排序条件</param>
        /// <returns></returns>
        public object GetPositionList(int page, int limit, string swhere, string sort)
        {
            return _basePositionBll.GetPositionList(page, limit, swhere, sort);
        }
        /// <summary>
        /// 职位表保存事件
        /// </summary>
        /// <param name="position">职位表实体</param>
        /// <returns>true:保存成功,false:保存失败</returns>
        public object PostPositionSave(Base_Position position)
        {
            return _basePositionBll.PostPositionSave(position);
        }
        /// <summary>
        /// 批量删除事件
        /// </summary>
        /// <param name="PostClass">OID的集合</param>
        /// <returns>true:删除成功,false:删除失败</returns>
        public object PostPositionDelete(PostClass PostClass)
        {
            return _basePositionBll.PostPositionDelete(PostClass);
        }
        /// <summary>
        /// 判断Code是否已存在
        /// </summary>
        /// <param name="OID"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public bool GetJudgeByCode(string OID, string code)
        {
            return _basePositionBll.GetJudgeByCode(OID, code);
        }
        #endregion
    }
}
