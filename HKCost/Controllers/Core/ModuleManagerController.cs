using BLL.Interfaces.IBase;
using BLL.Interfaces.IBusiness.ICore;
using Common.CommonClass;
using Domain.Core;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System;
using Common.QueryHelper;

namespace HKCost.Controllers.Core
{
    /// <summary>
    /// 菜单的管理
    /// </summary>
    public class ModuleManagerController : ApiController
    {
        #region 属性定义
        #endregion

        #region BLL的IoC映射
        private readonly IModuleBLL _service;
        public ModuleManagerController(IModuleBLL _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取父节点为 pid 的所有子节点信息
        /// </summary>
        /// <param name="pid">父节点id</param>
        /// <returns></returns>
        public object GetModulesList(string pid)
        {
            return _service.GetModulesList(pid, _service.GetIgoreList());
        }
        /// <summary>
        /// 获取所有菜单信息
        /// </summary>
        /// <returns>treegrid格式 json(object)</returns>
        public object GetAllModulesForTree()
        {
            return _service.GetAllModulesForTree();
        }
        /// <summary>
        /// 用户列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetModulesList(int page, int limit, string swhere, string sort)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort };
            return _service.GetModulesList(pagePara);
        }

        /// <summary>
        /// 保存
        /// 信息的添加或者修改保存
        /// 获取某组织机构下 modules 权限
        /// </summary>
        /// <param name="orgId">组织机构id</param>
        /// <returns></returns>
        public object GetOrgModulesList(string orgId)
        {
            return _service.GetOrgModulesList(orgId);
        }
        /// <summary>
        /// 获取父节点为 pid 的所有子节点信息
        /// </summary>
        /// <param name="permission">保存的实体对象</param>
        /// <returns></returns>
        public bool PostSave(PostClass PostClass)
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
        /// 菜单拖拽
        /// </summary>
        /// <param name="PostClass">{dropOID:'拖拽节点OID',targetOID:'目标节点OID',dropPosition:'拖拽位置（参照目标节点）"before"之前,"after"之后,"append"之内'}</param>
        /// <returns>true/false</returns>
        public bool PostDrop(PostClass PostClass)
        {
            dynamic param = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData, null);
            string dropOID = param.dropOID.ToString();
            string targetOID = param.targetOID.ToString();
            string dropPosition = param.dropPosition.ToString();
            return _service.DropWithTree(dropOID, targetOID, dropPosition);
        }
        /// <summary>
        ///删除
        ///批量删除
        /// </summary>
        /// <param name="OID">删除的主键IDS</param>
        /// <returns></returns>
        [HttpPost]
        public object Delete(PostClass PostClass)
        {
            return _service.Delete(PostClass);
        }
        /// <summary>
        /// 判断是否重复
        /// </summary>
        /// <param name="OID">当前菜单OID</param>
        /// <param name="col">判断字段</param>
        /// <param name="val">判断字段的值</param>
        /// <returns>true有重复，false无重复</returns>
        public bool GetIsExist(string OID, string col, string val)
        {
            return _service.GetIsExist(OID, col, val);
        }
        /// <summary>
        /// 更新菜单权限
        /// </summary>
        /// <param name="PostClass">菜单权限管理对象{PostData:[{OID:oid1,Permission:[oid1,oid2]},{...},...]}</param>
        /// <returns>true/false</returns>
        public bool PostPermissionSave(PostClass PostClass)
        {
            return _service.PostPermissionSave(PostClass);
        }
        /// <summary>
        /// 组织机构树上下移动
        /// </summary>
        /// <param name="PostClass">{PostData:OrgOid☻up/down}</param>
        /// <returns>true,false</returns>
        [HttpPost]
        public object ModuleTreeMove(PostClass PostClass)
        {
            bool bool_ref = false;
            if (PostClass.PostData.ToString().Split('☻').Length == 2)
            {
                string moduleOid = PostClass.PostData.ToString().Split('☻')[0];
                string moveType = PostClass.PostData.ToString().Split('☻')[1];
                Base_ModuleInfo MoveModule = _service.FindBy(o => o.OID == moduleOid).FirstOrDefault();
                if (moveType == "up")
                {
                    bool_ref = _service.MoveWithTree(MoveModule, -1);
                }
                else if (moveType == "down")
                {
                    bool_ref = _service.MoveWithTree(MoveModule, 1);
                }
            }
            return bool_ref;
        }
        public object GetModulePermissionByOid(string oid)
        {
            Base_ModuleInfo ModuleInfo = _service.FindBy(o => o.OID == oid && o.State == 0).FirstOrDefault();
            List<Base_PermissionInfo> Permissions = new List<Base_PermissionInfo>();
            if (ModuleInfo != null)
                Permissions = ModuleInfo.Permissions.ToList();
            return Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(Permissions, new List<string> { "Modules", "Roles" }), null);
        }

        public bool PostDelPermissionSave(PostClass PostClass)
        {
            return _service.PostDelPermissionSave(PostClass);
        }
        #endregion
    }
}
