using BLL.Interfaces.IBase;
using Common.CommonClass;
using Common.QueryHelper;
using Domain.Core;
using System.Collections.Generic;
using System.Web.Http;
namespace WebFrame.Controllers.Core
{
    /// <summary>
    /// 权限码表管理
    /// </summary>
    public class PermissionManagerController : ApiController
    {
        #region 属性定义
        List<string> igorelist = new List<string>();//当前集合需要过滤的字段
        #endregion

        #region BLL的IoC映射
        private readonly IReadWriteBLL<Base_PermissionInfo> _service;
        public PermissionManagerController (IReadWriteBLL<Base_PermissionInfo> _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取全部权限数据
        /// </summary>
        /// <returns></returns>
        public object GetPermissionList ()
        {
            return Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(_service.All(), GetIgoreList()), null);
        }
        /// <summary>
        /// 用户列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetPermissionList (int page, int limit, string swhere, string sort)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjSql = "from Base_PermissionInfo", ObjName = "permissions", Igorelist = GetIgoreList() };
            return _service.GetAllPageList(pagePara);
        }
        /// <summary>
        /// 保存
        /// 信息的添加或者修改保存
        /// </summary>
        /// <param name="permission">保存的实体对象</param>
        /// <returns></returns>
        public bool PostSave (PostClass PostClass)
        {
            Base_PermissionInfo permission_new = Common.NewtonJsonHelper.Deserialize<Base_PermissionInfo>(PostClass.PostData.ToString(), null);
            //Base_PermissionInfo permission_old = _service.GetBy(op => op.OID == permission_new.OID);
            //if (permission_old != null)
            //{
            //    permission_new.Roles = permission_old.Roles;
            //    permission_new.Modules = permission_old.Modules;
            //}
            return _service.Merge(permission_new);
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
            ProcessResult result = new ProcessResult() { ResultFlag = "false", Message = "", SuccessCount = 0, ErrorCount = 0 };
            string str_delids = PostClass.PostData.ToString();
            int i = _service.Delete(str_delids);
            result.SuccessCount = i;
            result.ErrorCount = str_delids.Split(',').Length - i;
            result.ResultFlag = "true";
            result.Message = "处理成功!";
            return result.OutPutMessage();
        }
        /// <summary>
        /// 获取过滤字段
        /// </summary>
        /// <returns>过滤字段集合</returns>
        private List<string> GetIgoreList ()
        {
            igorelist.Add("Roles");
            igorelist.Add("Modules");
            return igorelist;
        }
        #endregion
    }
}