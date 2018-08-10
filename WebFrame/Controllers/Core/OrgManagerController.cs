using System.Collections.Generic;
using System.Web.Http;
using Common.CommonClass;
using BLL.Interfaces.IBusiness.ICore;
using System;
using Domain.Core;
using System.Linq;
using Common.QueryHelper;
using System.Text;

namespace WebFrame.Controllers.Core
{
    public class OrgManagerController : ApiController
    {
        #region 属性定义
        #endregion

        #region BLL的IoC映射
        private readonly IOrgBLL _service;
        public OrgManagerController(IOrgBLL _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取父节点为 pid 的所有子节点信息——用于构造组织机构树，分步加载
        /// </summary>
        /// <param name="pid">父节点id</param>
        /// <returns></returns>
        public object GetOrgList(string pid)
        {
            return _service.GetOrgList(pid, _service.GetIgoreList(), "layer");
        }
        /// <summary>
        /// 获取全部组织机构数据
        /// </summary>
        /// <returns></returns>
        public object GetOrgList()
        {
            return _service.GetOrgList();
        }
        /// <summary>
        /// 获取该组织机构下的所有节点——用于构造组织机构树，完全加载
        /// </summary>
        /// <param name="orgId">根组织机构id</param>
        /// <returns></returns>
        public object GetOrgList(string orgId, string type)
        {
            return _service.GetOrgList(orgId, type);
        }
        /// <summary>
        /// 用户列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetOrgList(int page, int limit, string swhere, string sort)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjName = "orginfo" };
            return _service.GetOrgList(pagePara);
        }
        /// <summary>
        /// 获取该组织机构下的所有节点——用户为ext treegrid提供数据
        /// </summary>
        /// <param name="orgId">根组织机构id,加载所有组织机构未00000000-0000-0000-0000-000000000000</param>
        /// <returns>json(object)</returns>
        public object GetOrgListForTreegrid(string orgId)
        {
            #region"取出符合要求的所有组织机构"
            List<Base_OrgInfo> orgList = _service.FindBy(o => o.ParentOID == orgId).ToList();
            int lt = 0;
            int rt = 0;
            foreach (Base_OrgInfo org in orgList)
            {
                if (lt == 0 && rt == 0)
                {
                    lt = org.LT;
                    rt = org.RT;
                }
                else
                {
                    if (org.LT < lt)
                    {
                        lt = org.LT;
                    }
                    if (org.RT > rt)
                    {
                        rt = org.RT;
                    }
                }
            }
            List<Base_OrgInfo> selectOrgList = _service.FindBy(o => o.LT >= lt && o.RT <= rt).ToList();
            #endregion
            StringBuilder _orgJson = new StringBuilder();
            _orgJson.Append("{\"text\":\"根节点\",\"OID\":\"" + Guid.Empty.ToString() + "\",\"expanded\":true,\"children\":[");

            int lastTreeLevel = 0;
            int currentTreeLevel = 0;
            int firstTreeLevel = selectOrgList.OrderBy(o => o.LT).ToList()[0].TreeLevel;
            foreach (Base_OrgInfo co in selectOrgList.OrderBy(o => o.LT))
            {
                currentTreeLevel = co.TreeLevel;

                if (currentTreeLevel < lastTreeLevel)
                {
                    _orgJson.Remove(_orgJson.Length - 1, 1);
                    for (int j = 0; j < lastTreeLevel - currentTreeLevel; j++)
                    {
                        _orgJson.Append("]},");
                    }
                }

                _orgJson.Append("{");
                _orgJson.Append("OID:'");
                _orgJson.Append(co.OID);
                _orgJson.Append("',Code:'");
                _orgJson.Append(co.Code);
                _orgJson.Append("',text:'");
                _orgJson.Append(co.Name);
                _orgJson.Append("',Name:'");
                _orgJson.Append(co.Name);
                _orgJson.Append("',ParentOID:'");
                _orgJson.Append(co.ParentOID);
                _orgJson.Append("',LT:");
                _orgJson.Append(co.LT);
                _orgJson.Append(",RT:");
                _orgJson.Append(co.RT);
                _orgJson.Append(",TreeLevel:");
                _orgJson.Append(co.TreeLevel);
                _orgJson.Append(",OrgLevel:");
                _orgJson.Append(co.OrgLevel);
                _orgJson.Append(",OrgNo:'");
                _orgJson.Append(co.OrgNo);
                _orgJson.Append("',EnglishName:'");
                _orgJson.Append(co.EnglishName);
                _orgJson.Append("',Description:'");
                _orgJson.Append(co.Description);
                _orgJson.Append("',ShortName:'");
                _orgJson.Append(co.ShortName);
                _orgJson.Append("',SortCode:'");
                _orgJson.Append(co.SortCode);
                _orgJson.Append("',State:");
                _orgJson.Append(co.State);
                _orgJson.Append(",OrgType:");
                _orgJson.Append(co.OrgType);
                _orgJson.Append(",checked:false");
                _orgJson.Append(",iconCls:'noIcon'");
                _orgJson.Append(",CreateTime:'");
                _orgJson.Append(co.CreateTime);

                _orgJson.Append((selectOrgList.Where(op => op.ParentOID == co.OID.ToString()).ToList().Count == 0) ? "',leaf: true}," : (co.TreeLevel == 1) ? "',expanded:true,children:[" : "',expanded:false,children:[");
                lastTreeLevel = currentTreeLevel;
            }
            _orgJson.Remove(_orgJson.Length - 1, 1);
            for (int j = currentTreeLevel - firstTreeLevel; j > 0; j--)
            {
                _orgJson.Append("]}");
            }

            _orgJson.Append("]}");
            string jsonData = _orgJson.ToString();
            return Common.NewtonJsonHelper.Deserialize<object>(jsonData, null);
        }
        /// <summary>
        /// 保存
        /// 信息的添加或者修改保存
        /// </summary>
        /// <param name="permission">保存的实体对象</param>
        /// <returns></returns>
        public bool PostSave(PostClass PostClass)
        {
            return _service.SaveOrUpdate(PostClass);
        }
        /// <summary>
        /// 组织机构菜单管理--保存方法
        /// </summary>
        /// <param name="PostClass">前台传回来的操作对象</param>
        /// <returns>true/false</returns>
        public bool PostOrgModuleSave(PostClass PostClass)
        {
            return _service.SaveOrgModuleRelation(PostClass);
        }
        /// <summary>
        /// 保存组织机构角色信息关系
        /// </summary>
        /// <param name="PostClass">前台传回来的操作对象</param>
        /// <returns>true/false</returns>
        public bool PostOrgRoleSave(PostClass PostClass)
        {
            return _service.SaveOrgRoleRelation(PostClass);
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
        /// 组织机构树上下移动
        /// </summary>
        /// <param name="PostClass">{PostData:OrgOid☻up/down}</param>
        /// <returns>true,false</returns>
        [HttpPost]
        public object OrgTreeMove(PostClass PostClass)
        {
            bool bool_ref = false;
            if (PostClass.PostData.ToString().Split('☻').Length == 2)
            {
                string orgOid = PostClass.PostData.ToString().Split('☻')[0];
                string moveType = PostClass.PostData.ToString().Split('☻')[1];
                Base_OrgInfo MoveOrg = _service.FindBy(o => o.OID == orgOid).FirstOrDefault();
                if (moveType == "up")
                {
                    bool_ref = _service.MoveWithTree(MoveOrg, -1);
                }
                else if (moveType == "down")
                {
                    bool_ref = _service.MoveWithTree(MoveOrg, 1);
                }
            }
            return bool_ref;
        }
        /// <summary>
        /// 菜单拖拽
        /// </summary>
        /// <param name="PostClass">{dropOID:'拖拽节点OID',targetOID:'目标节点OID',dropPosition:'拖拽位置（参照目标节点）"before"之前,"after"之后,"append"之内'}</param>
        /// <returns>true/false</returns>
        [HttpPost]
        public bool PostDrop(PostClass PostClass)
        {
            dynamic param = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData, null);
            string dropOID = param.dropOID.ToString();
            string targetOID = param.targetOID.ToString();
            string dropPosition = param.dropPosition.ToString();
            return _service.DropWithTree(dropOID, targetOID, dropPosition);
        }
        #endregion
    }
}
