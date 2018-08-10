using BLL.Implements.Base;
using Common.CommonClass;
using Common.QueryHelper;
using DAL;
using DAL.Implements.Base;
using Domain.Core;
using Service.Interfaces.Core;
using System;
using System.Collections.Generic;

namespace Service.Implements.Core
{
    public class BasePositionBLL : BaseBLL<Base_Position>, IBasePositionBLL
    {
        public BasePositionBLL(UnitOfWork _uow)
            : base(_uow)
        { }
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
            swhere = swhere != null ? swhere.TrimEnd(',') + ",STATE|int|0|=" : "STATE|int|0|=";
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjName = "PositionList", Igorelist = new List<string>() };
            QueryParameter query = new QueryParameter("Base_Position", pagePara.Swhere, pagePara, null);
            return this.GetAllPageList(query);
        }
        /// <summary>
        /// 职位表保存事件
        /// </summary>
        /// <param name="position">职位表实体</param>
        /// <returns>true:保存成功,false:保存失败</returns>
        public bool PostPositionSave(Base_Position position)
        {
            if (string.IsNullOrEmpty(position.OID))
            {
                position.CREATER = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser).OID;
                position.CREATETIME = DateTime.Now;
            }
            return this.SaveOrUpdate(position);
        }
        /// <summary>
        /// 批量删除事件
        /// </summary>
        /// <param name="PostClass">OID的集合</param>
        /// <returns>true:删除成功,false:删除失败</returns>
        public bool PostPositionDelete(PostClass PostClass)
        {
            string OIDs = PostClass.PostData;
            return this.LogicDelete(OIDs) > 0;
        }
        /// <summary>
        /// 判断Code是否已存在
        /// </summary>
        /// <param name="OID">OID</param>
        /// <param name="code">code</param>
        /// <returns></returns>
        public bool GetJudgeByCode(string OID, string code)
        {
            bool res = false;
            int count = 0;
            if (string.IsNullOrEmpty(OID) || OID == "undefined")
            {
                count = SessionFactory.GetCurrentSession().QueryOver<Base_Position>().Where(o => o.STATE == 0 && o.CODE == code).RowCount();
            }
            else
            {
                count = SessionFactory.GetCurrentSession().QueryOver<Base_Position>().Where(o => o.STATE == 0 && o.CODE == code && o.OID != OID).RowCount();
            }
            if (count > 0)
            {
                res = true;
            }
            return res;
        }
        #endregion
    }
}
