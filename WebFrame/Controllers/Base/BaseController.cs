using BLL.Interfaces.IBusiness.IAuth;
using Common;
using Common.Exceptions;
using Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Text;
using BLL.Interfaces.IBase;
using Common.QueryHelper;
using Common.CommonClass;
using BLL.Interfaces.IBusiness.ICore;
//using Service.Interfaces.UserInfo;

namespace WebFrame.Controllers.Base
{

    /// <summary>
    /// 基础控制器
    /// 用户登录,获取用户权限菜单
    /// 不受权限拦截控制
    /// </summary>
    public class BaseController : ApiController
    {

        #region BLL的IoC映射
        private readonly IAuthenticationBLL _authBll;
        private readonly IReadWriteBLL<Base_Dictionary> _dicBll;
 
        private readonly IUserBLL _userInfoBll;
        //private readonly IUserInfoBLL _userInfo;
        public BaseController(IAuthenticationBLL authBll, IReadWriteBLL<Base_Dictionary> diBll, IUserBLL userInfoBll )//, IUserInfoBLL userInfo)
        {
            _authBll = authBll;
            _dicBll = diBll;
      
            _userInfoBll = userInfoBll;
            //_userInfo = userInfo;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 验证用户名和密码
        /// 返回结果为json
        /// </summary>
        /// <param name="user">对象实体</param>
        /// <returns>结果内容包括(返回结果true，false 以及实体对象)</returns>
        public object PostUserForLogin(Base_UserInfo user)
        {
            return _authBll.GetByUserPwd(user.UserName, user.UserPwd);
        }

        /// <summary>
        /// 根据userid得到user实体
        /// 返回结果为json
        /// </summary>
        /// <param name="user">对象实体</param>
        /// <returns>结果内容包括(返回结果true，false 以及实体对象)</returns>
        public object PostUserByOID(Base_UserInfo user)
        {
            return _authBll.GetUserByOid(user.OID.ToString());
        }
        /// <summary>
        /// 更改密码
        /// </summary>
        /// <param name="userName">"{userOID:'用户OID',oldPwd:'旧密码',newPwd:'新密码'}"</param>
        /// <returns>true/false</returns>
        [HttpPost]
        public bool ChangePwdUpdate(Common.CommonClass.PostClass PostClass)
        {
            dynamic param = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData.ToString(), null);
            string userOID = param.userOID.ToString();
            string oldPwd = param.oldPwd.ToString();
            string newPwd = param.newPwd.ToString();
            return _authBll.ChangePwd(userOID, oldPwd, newPwd);
        }
        /// <summary>
        /// 个人信息修改
        /// </summary>
        /// <param name="PostClass">个人信息修改实体</param>
        /// <returns>true/false</returns>
        [HttpPost]
        public bool MyInfoUpdate(PostClass PostClass)
        {
            Base_UserInfo MyInfo = Common.NewtonJsonHelper.Deserialize<Base_UserInfo>(PostClass.PostData.ToString(), null);
            return _authBll.MyInfoUpdate(MyInfo);
        }
        /// <summary>
        /// 获取到用户可用module
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="orgId">当前组织机构</param>
        /// <param name="moduleEname">模块英文名称，如果不为空则返回该模块的所有子集，如果为空则返回所有</param>
        /// <returns>json</returns>
        public object GetUserModules(string userId, string orgId, string moduleEname)
        {
            try
            {
                List<Base_ModuleInfo> moduleList;
                //缓存Key值
                string cacheKey = userId + orgId + "_UserAuthModule";
                //判断缓存是否存在
                #region 缓存存在数据,取出缓存数据
                //缓存中存在菜单字典取出数据，如果字典中不存在该用户键值,取出数据存入
                object info = CacheHelper.GetLocalCache(cacheKey);
                if (info != null)
                {
                    moduleList = (List<Base_ModuleInfo>)info;
                }
                #endregion

                #region 缓存不存在,取出数据存入创建缓存
                else
                {
                    // 缓存中不存在菜单字典，创建字典存入缓存
                    moduleList = _authBll.GetAllowModuleByUser(userId, orgId);
                    if (moduleList.Count > 0)
                    {
                        CacheHelper.SaveLocalCache(null, TimeSpan.FromHours(_authBll.CacheHour), moduleList, cacheKey);

                    }
                    else
                    {
                        throw new PermissionLimittedException("noAuth");
                    }
                }
                #endregion

                #region 过滤结果集合
                if (moduleList != null & moduleList.Count > 0)
                {
                    //转化成json串
                    if (!string.IsNullOrEmpty(moduleEname))//如果moduleEname不为空值，代表请求某菜单下的按钮
                    {
                        Base_ModuleInfo parentObj = moduleList.Where(op => op.EName == moduleEname).FirstOrDefault();
                        string parentModuleId = Guid.NewGuid().ToString().ToUpper();//默认给一个新创建的Guid
                        if (parentObj != null)
                        {
                            parentModuleId = parentObj.OID; //更改Guid值
                        }
                        moduleList = moduleList.Where(op => op.Flag == 1 || op.Flag == 3 || op.Flag == 4).Where(op => op.ParentOID == parentModuleId.ToString()).OrderBy(op => op.LT).ToList();
                    }
                    else//如果moduleEname为空值，代表请求整个权限菜单
                    {
                        moduleList = moduleList.Where(op => op.Flag == 0).OrderBy(op => op.LT).ToList();
                    }
                }
                #endregion

                #region 过滤结果字段
                object delresult;
                List<string> removeCols = new List<string>();
                removeCols.Add("Buttons");
                removeCols.Add("Orgs");
                removeCols.Add("Permissions");
                delresult = Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(moduleList, removeCols), null);
                #endregion

                return delresult;
            }
            catch (Exception err)
            {
                throw new PermissionLimittedException("noAuth", err);
            }
        }

        /// <summary>
        /// 获取到用户可用的module并返回菜单树
        /// </summary>
        /// <param name="userId">用户id</param>
        /// <param name="orgId">当前组织机构id</param>
        /// <returns>json</returns>
        public object GetUserMenuTree(string userId, string orgId)
        {
            try
            {
                List<Base_ModuleInfo> moduleList;
                //缓存Key值
                string cacheKey = userId + orgId + "_UserAuthModule";
                //判断缓存是否存在
                #region 缓存存在数据,取出缓存数据
                //缓存中存在菜单字典取出数据，如果字典中不存在该用户键值,取出数据存入
                object info = CacheHelper.GetLocalCache(cacheKey);
                if (info != null)
                {
                    moduleList = (List<Base_ModuleInfo>)info;
                }
                #endregion

                #region 缓存不存在,取出数据存入创建缓存
                else
                {
                    // 缓存中不存在菜单字典，创建字典存入缓存
                    moduleList = _authBll.GetAllowModuleByUser(userId, orgId);
                    if (moduleList.Count > 0)
                    {
                        CacheHelper.SaveLocalCache(null, TimeSpan.FromHours(_authBll.CacheHour), moduleList, cacheKey);

                    }
                    else
                    {
                        throw new PermissionLimittedException("noAuth");
                    }
                }
                #endregion

                #region 过滤结果集合
                if (moduleList != null & moduleList.Count > 0)
                {
                    moduleList = moduleList.Where(op => op.Flag == 0).OrderBy(op => op.LT).ToList();

                }
                #endregion

                #region 过滤结果字段
                StringBuilder _module = new StringBuilder();
                _module.Append("{\"text\":\"root\",\"children\":[");
                #region"根据LT,RT生成json对象"
                _module.Append(GetTreeJson(moduleList));
                #endregion
                _module.Append("]}");


                object delresult = Common.NewtonJsonHelper.Deserialize<object>(_module.ToString(), null);
                #endregion

                return delresult;
            }
            catch (Exception err)
            {
                throw new PermissionLimittedException("noAuth", err);
            }
        }

        /// <summary>
        /// 根据LT,RT,TreeLevel构造treejson
        /// </summary>
        /// <param name="MenuList">菜单数据集合</param>
        /// <returns>json  {X:X,children:[{},{}]}</returns>
        private string GetTreeJson(List<Base_ModuleInfo> MenuList)
        {
            StringBuilder _module = new StringBuilder();
            int lastTreeLevel = 0;
            int currentTreeLevel = 0;
            int firstTreeLeval = MenuList.OrderBy(o => o.LT).ToList()[0].TreeLevel;
            foreach (Base_ModuleInfo co in MenuList.OrderBy(o => o.LT))
            {
                currentTreeLevel = co.TreeLevel;

                if (currentTreeLevel < lastTreeLevel)
                {
                    _module.Remove(_module.Length - 1, 1);
                    for (int j = 0; j < lastTreeLevel - currentTreeLevel; j++)
                    {
                        if (j + 1 == lastTreeLevel - currentTreeLevel)
                            _module.Append("]},");
                        else
                            _module.Append("]}");
                    }
                }
                _module.Append("{");
                _module.Append("text:'");
                //_module.Append(co.Name);
                _module.Append(!string.IsNullOrEmpty(co.Ico) ? "<i class=\"fa " + co.Ico.Split('|')[1] + "\"></i> " + co.Name : "" + co.Name);
                _module.Append("',iconCls:'noIcon");
                _module.Append("',id:'");
                _module.Append(co.EName + "|" + co.PathHandler);
                _module.Append((MenuList.Where(op => op.ParentOID == co.OID.ToString()).ToList().Count == 0) ? "',leaf: true}," : (co.TreeLevel == 1) ? "',expanded:false,children:[" : "',expanded:false,children:[");
                lastTreeLevel = currentTreeLevel;
            }
            _module.Remove(_module.Length - 1, 1);
            for (int j = currentTreeLevel - firstTreeLeval; j > 0; j--)
            {
                _module.Append("]}");
            }
            return _module.ToString();
        }

        /// <summary>
        ///根据字段名称获取数据字段值
        /// </summary>
        /// <param name="fileName">字段名称</param>
        /// <returns>传回前台的json串</returns>
        public object GetDicList(string fileName)
        {
            Base_Dictionary dic = _dicBll.FindBy(op => op.FILENAME == fileName).SingleOrDefault();
            IList<Dictionary> list = QueryHelper.GetDicByContent(dic.CONTENT);
            return Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(list, null), null);
        }
        /// <summary>
        /// 获取应用rsa加密参数
        /// </summary>
        /// <returns></returns>
        public object GetRSAPublicKey()
        {
            string exponent = System.Configuration.ConfigurationManager.AppSettings["exponent"];
            string modulus = System.Configuration.ConfigurationManager.AppSettings["modulus"];
            string ref_str = "{result:true,exponent:'" + exponent + "',modulus:'" + modulus + "'}";
            return Common.NewtonJsonHelper.Deserialize<object>(ref_str, null);
        }
    
        /// <summary>
        /// 根据用户名和邮箱找回密码
        /// </summary>
        /// <param name="UserName"></param>
        /// <param name="Email"></param>
        /// <returns></returns>
        public object PostSendEmailSave(PostClass PostClass)
        {
            dynamic d = Common.NewtonJsonHelper.Deserialize<object>(PostClass.PostData.ToString(), null);
            string UserName = Convert.ToString(d.UserName);
            string Email = Convert.ToString(d.Email); ;
            string Random = Convert.ToString(d.Random); ;
            return _authBll.PostSendEmailSave(UserName, Email, Random);
        }
        /// <summary>
        /// 判断验证信息是否超时
        /// </summary>
        /// <param name="Data"></param>
        /// <returns></returns>
        public object GetFindPwdByCode(string signature, string timestamp, string nonce, string value)
        {
            return _authBll.GetFindPwdByCode(signature, timestamp, nonce, value);
        }
        /// <summary>
        ///  重置密码
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        public object PostChangePwdSave(PostClass PostClass)
        {
            return _authBll.PostChangePwdSave(PostClass);
        }        
        #endregion
    }
}
