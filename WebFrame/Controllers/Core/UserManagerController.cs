using Common.CommonClass;
using Domain.Core;
using System.Collections.Generic;
using System.Web.Http;
using BLL.Interfaces.IBusiness.ICore;
using System.Linq;
using System;
using System.Net.Http;
using System.Data;
using Common.QueryHelper;


namespace WebFrame.Controllers.Core
{
    /// <summary>
    /// 用户管理
    /// </summary>
    public class UserManagerController : ApiController
    {
        #region 属性定义
        #endregion

        #region BLL的IoC映射
        private readonly IUserBLL _service;
        public UserManagerController(IUserBLL _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 判断是否有重用户名用户
        /// </summary>
        /// <param name="OID">当前用户OID</param>
        /// <param name="col">判断字段</param>
        /// <param name="val">判断字段的值</param>
        /// <returns></returns>
        public object GetIsExist(string OID, string col, string val)
        {
            bool IsExist = false;
            if (col == "UserName")
            {
                List<Base_UserInfo> ExistList = _service.FindBy(op => op.UserName == val).ToList();
                if (ExistList.Count > 0)
                {
                    if (string.IsNullOrEmpty(OID))
                    {
                        IsExist = true;
                    }
                    else if ( ExistList[0].OID ==OID)
                    {
                        IsExist = false;
                    }
                    else
                    {
                        IsExist = true;
                    }
                }
                else
                {
                    IsExist = false;
                }
            }
            else if (col == "EMAIL")
            {
                List<Base_UserInfo> ExistList = _service.FindBy(op => op.EMAIL == val).ToList();
                if (ExistList.Count > 0)
                {  
                    if (string.IsNullOrEmpty(OID))
                    {
                        IsExist = true;
                    }
                    else if (ExistList[0].OID == OID)
                    {
                        IsExist = false;
                    }
                    else
                    {
                        IsExist = true;
                    }
                }
                else
                {
                    IsExist = false;
                }
            }
            return IsExist;
        }
        /// <summary>
        /// 根据ID得到详情
        /// </summary>
        /// <param name="OID"></param>
        /// <returns></returns>
        public Base_UserInfo Get(string OID)
        {
            return _service.GetBy(OID);
        }
        /// <summary>
        /// 用户列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetUserList (int page, int limit, string swhere, string sort,string type)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjName = "users", Type=type };
            return _service.GetUserList(pagePara);
        }
        /// <summary>
        /// 获取当前登陆人组织机构下人员分页信息
        /// </summary>
        /// <param name="page">当前页码</param>
        /// <param name="limit">每页条数</param>
        /// <param name="swhere">主表搜索条件</param>
        /// <param name="sort">排序</param>
        /// <param name="curOrgOID">当前登陆人所属组织机构</param>
        /// <returns></returns>
        public object GetUserListByCurOrg(int page, int limit, string swhere, string sort, string curOrgOID)
        {
            return _service.GetUserList(page, limit, swhere, sort, curOrgOID);
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
        ///删除
        ///批量删除
        /// </summary>
        /// <param name="delList">删除实体集合类</param>
        /// <returns></returns>
        [HttpPost]
        public object Delete(PostClass PostClass)
        {
            return _service.Delete(PostClass);
        }

        /// <summary>
        /// 用户角色关系保存
        /// </summary>
        /// <returns>true/false</returns>
        public bool SaveUserRoleRelation(PostClass PostClass)
        {
            return _service.SaveUserRoleRelation(PostClass);
        }

        /// <summary>
        /// 导出
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage Export()
        {
            #region"实体List数据导出"
            Dictionary<string, string> columnAlias = new Dictionary<string, string>();
            columnAlias.Add("Name", "姓名");
            columnAlias.Add("UserName", "用户名");
            columnAlias.Add("UserPwd", null);
            columnAlias.Add("CreateTime", null);

            return _service.Export("用户数据导出", columnAlias, "xls");
            #endregion
            #region"datatable数据导出"
            //DataTable dt = new DataTable();
            //dt.Columns.Add("Name");
            //dt.Columns.Add("UserName");
            //dt.Columns.Add("UserPwd");
            //dt.Columns.Add("CreateTime");
            //dt.Rows.Add(dt.NewRow());
            //dt.Rows.Add(dt.NewRow());
            //dt.Rows[0]["Name"] = "张三";
            //dt.Rows[0]["UserName"] = "zhangsan";
            //dt.Rows[0]["UserPwd"] = "123456";
            //dt.Rows[0]["CreateTime"] = "2015-05-26";
            //dt.Rows[1]["Name"] = "李四";
            //dt.Rows[1]["UserName"] = "lisi";
            //dt.Rows[1]["UserPwd"] = "123456";
            //dt.Rows[1]["CreateTime"] = "2015-05-26";

            //Dictionary<string, string> columnAlias = new Dictionary<string, string>();
            //columnAlias.Add("Name", "姓名");
            //columnAlias.Add("UserName", "用户名");
            //columnAlias.Add("UserPwd", "密码");
            //columnAlias.Add("CreateTime", "创建时间");
            //return Common.CommonClass.ImExPort<Base_UserInfo>.Export("用户数据导出", dt, columnAlias, "xls");
            #endregion
        }
        /// <summary>
        /// 逻辑删除用户信息
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        public object PostLogicDelete(PostClass PostClass)
        {
            return _service.PostLogicDelete(PostClass);
        }
        #endregion

    
    }
}
