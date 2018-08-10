using System.Collections.Generic;
using System.Web.Http;
using BLL.Interfaces.IBusiness.ICore;
using Common.CommonClass;
using Common.QueryHelper;

namespace HKCost.Controllers.Core
{
    public class RoleManagerController : ApiController
    {
        #region 属性定义
        #endregion

        #region BLL的IoC映射
        //private readonly IReadWriteBLL<Base_RoleInfo> _service;
        private readonly IRoleBLL _service;
        
        public RoleManagerController (IRoleBLL _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取全部角色数据
        /// </summary>
        /// <returns></returns>
        public object GetRoleList ()
        {
            return _service.GetRoleList();
        }
        /// <summary>
        /// 用户列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetRoleList (int page, int limit, string swhere, string sort, string type)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjName = "roles", Type=type };
            return _service.GetRoleList(pagePara);
        }
        /// <summary>
        /// 保存
        /// 信息的添加或者修改保存
        /// </summary>
        /// <param name="Role">保存的实体对象</param>
        /// <returns></returns>
        public bool PostSave (PostClass PostClass)
        {
            bool res = _service.SaveOrUpdate(PostClass);
            if (res)
            {
                //请求缓存
                Common.CacheHelper.RemoveLocalCache("all");
            }
            return res;
        }
        /// <summary>
        ///删除
        ///批量删除
        /// </summary>
        /// <param name="delList">删除实体集合类</param>
        /// <returns></returns>
        [HttpPost]
        public object Delete (PostClass PostClass)
        {
            //请求缓存
            Common.CacheHelper.RemoveLocalCache("all");
            return _service.Delete(PostClass);
        }
        /// <summary>
        /// 角色批量配置权限
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        [HttpPost]
        public bool RolePermissionSave(PostClass PostClass) 
        {
            bool res =  _service.RolePermissionSave(PostClass);
            if (res)
            {
                //请求缓存
                Common.CacheHelper.RemoveLocalCache("all");
            }
            return res;
        }
        #endregion
    }
}
