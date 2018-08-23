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
using Service.Interfaces.BaseCode;
using System.Web;
using Service.Interfaces.Core;
using System.IO;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Diagnostics;

namespace HKCost.Controllers.Base
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
        private readonly IBaseCodeBLL _codeBll;
        private readonly IBaseRecoverBLL _recoverBLL;
        public BaseController(IAuthenticationBLL authBll, IReadWriteBLL<Base_Dictionary> diBll, IUserBLL userInfoBll,
              IBaseCodeBLL codeBll, IBaseRecoverBLL recoverBll)
        {
            _authBll = authBll;
            _dicBll = diBll;
            _userInfoBll = userInfoBll;
            _codeBll = codeBll;
            _recoverBLL = recoverBll;
        }
        #endregion

        #region 业务方法(基础)
        /// <summary>
        /// 保存
        /// 信息的添加或者修改保存
        /// </summary>
        /// <param name="permission">保存的实体对象</param>
        /// <returns></returns>
        public bool PostSave(Base_UserInfo PostClass)
        { 
            return _userInfoBll.SaveOrUpdate(PostClass);
        }
      
        /// <summary>
        /// 查询用户名是否相同
        /// </summary>
        /// <param name="Name"></param>
        /// <returns></returns>
        public bool GetJudgeUserName(string Name)
        {
            return _codeBll.GetJudgeUserName(Name);
        }

        /// <summary>
        /// 验证用户名和密码
        /// 返回结果为json
        /// </summary>
        /// <param name="user">对象实体</param>
        /// <returns>结果内容包括(返回结果true，false 以及实体对象)</returns>
        public object PostUserForLogin(Base_UserInfo user)
        {
            return _codeBll.GetByUserPwdSave(user.UserName, user.UserPwd);
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
            string Random = Convert.ToString(d.Random);
            return _authBll.PostSendEmailSave(UserName, Email, Random);
        }
        ///// <summary>
        ///// 根据邮箱发送验证码
        ///// </summary>
        ///// <param name="email">邮箱</param>
        ///// <returns></returns>
        //public bool GetEmailUpdate(string email)
        //{
        //    return _recoverBLL.GetEmailUpdate(email);

        //}
        /// <summary>
        /// 根据输入验证码进行验证
        /// </summary>
        /// <param name="data">验证码 和 验证者OID</param>
        /// <returns></returns>
        public string PostCheckCaptcha(PostClass data)
        {
            dynamic postData = Common.NewtonJsonHelper.Deserialize<dynamic>(data.PostData, null);
            return _recoverBLL.PostCheckCaptcha(Convert.ToString(postData.captcha), Convert.ToString(postData.email));
        }
        //public bool PostResetPwd(PostClass data)
        //{
        //    dynamic postData = Common.NewtonJsonHelper.Deserialize<dynamic>(data.PostData, null);
        //    return _recoverBLL.PostResetPwd(Convert.ToString(postData.OID), Convert.ToString(postData.newPwd));
        //}
        /// <summary>
        /// 修改密码
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public object PostResetPwdUpdate(Base_UserInfo user)
        {
            return _recoverBLL.PostResetPwdUpdate(user.UserPwd);
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
        #region 业务扩展方法
        /// <summary>
        /// 更新图片
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        public object PhotoUpdate(PostClass PostClass)
        {
            bool res = false;
            dynamic dy = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData.ToString(), null);
            string imgData = dy.dataUrl;
            string imgUrl = dy.imgUrl;
            string curUserOID = dy.curUserOID;
            Base_UserInfo UserInfo = _userInfoBll.FindBy(t => t.OID == curUserOID).ToList<Base_UserInfo>().FirstOrDefault();
            if (UserInfo != null)
            {
                string photo = Tools.ImgHelper.ImgUpload(imgData, imgUrl);
                UserInfo.BusinessImg = photo;
                res = _userInfoBll.SaveOrUpdate(UserInfo);
            }
            return res;
        }
        /// <summary>
        /// 上传图片获取图片路径
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns>图片路径</returns>
        public object UploadPhoto(PostClass PostClass)
        {
            dynamic dy = Common.NewtonJsonHelper.Deserialize<dynamic>(PostClass.PostData.ToString(), null);
            string imgData = dy.dataUrl;
            string imgUrl = dy.imgUrl;
            string ImgUrl = Tools.ImgHelper.ImgUpload(imgData, imgUrl);
            return ImgUrl;
        }
        /// <summary>
        /// 根据当前登陆的用户获取菜单
        /// </summary>
        /// <returns></returns>
        public object GetUserMenuTree()
        {
            Base_UserInfo user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser);
            if (user==null)
                return null;
            string orgOID = user.Orgs.FirstOrDefault().OID;
            try
            {
                List<Base_ModuleInfo> moduleList;
                //缓存Key值
                string cacheKey = user.OID + orgOID + "_UserAuthModule";
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
                    moduleList = _authBll.GetAllowModuleByUser(user.OID, orgOID);
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
                _module.Append("{\"text\":\"root\",\"submenu\":[");
                #region"根据LT,RT生成json对象"
                _module.Append(GetWebTreeJson(moduleList));
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
        private string GetWebTreeJson(List<Base_ModuleInfo> MenuList)
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
                _module.Append(co.Name);
                _module.Append("',icon:'");
                _module.Append(!string.IsNullOrEmpty(co.Ico) ? "fa " + co.Ico.Split('|')[1] : "");
                _module.Append((MenuList.Where(op => op.ParentOID == co.OID.ToString()).ToList().Count == 0) ? ("',sref:'" + co.EName + "'},")
                    : (co.TreeLevel == 1) ? "',sref:'#',submenu:[" : "',sref:'#',submenu:[");
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
        /// 判断当前是否有人登陆
        /// </summary>
        /// <returns></returns>
        public bool GetJudgeIsLogin()
        {
            return Tools.SessionHelper.JudgeSession(Tools.SessionHelper.SessinoName.CurUser);
        }
        /// <summary>
        /// 退出登陆
        /// </summary>
        /// <returns></returns>
        public bool PostLogout()
        {
            return Tools.SessionHelper.RemoveSession(Tools.SessionHelper.SessinoName.CurUser);
        }
        /// <summary>
        /// 根据路由name和当前登陆判断此路由是否允许传入
        /// </summary>
        /// <param name="routeState">路由名称</param>
        /// <returns></returns>
        public string GetIsAllowByHtmlUrl(string routeState)
        {
            //如果路由为空直接返回失败
            if (string.IsNullOrEmpty(routeState))
                return "error";
            //如果是page下的页面则直接返回
            if (routeState.ToLower().IndexOf("page.") == 0)
                return "ok";
            //如果当前用户为空返回用户未登录
            if (!Tools.SessionHelper.JudgeSession(Tools.SessionHelper.SessinoName.CurUser))
                return "noLogin";
            Base_UserInfo user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser);
            List<Base_ModuleInfo> moduleList;
            string cachKey = user.OID + user.Orgs.FirstOrDefault().OID + "_UserAuthModule";

            #region 缓存存在数据,取出缓存数据
            //缓存中存在菜单字典取出数据，如果字典中不存在该用户键值,取出数据存入
            object info = CacheHelper.GetLocalCache(cachKey);
            if (info == null)
            {
                moduleList = _authBll.GetAllowModuleByUser(user.OID, user.Orgs.FirstOrDefault().OID);
                if (moduleList.Count > 0)
                    CacheHelper.SaveLocalCache(null, TimeSpan.FromHours(_authBll.CacheHour), moduleList, cachKey);
                else
                    return "noModule";
            }
            else
            {
                moduleList = (List<Base_ModuleInfo>)info;
            }
            bool isHave = moduleList.Where(t => t.EName == routeState).Count() > 0;
            return isHave ? "ok" : "noModule";
            #endregion
        }
        /// <summary>
        /// 根据路由名称和标识获取行操作按钮和工具栏按钮
        /// </summary>
        /// <param name="routeState">路由名称</param>
        /// <param name="flag">标识</param>
        /// <returns></returns>
        public List<Base_ModuleInfo> GetButtonByEname(string routeState, int flag)
        {
            Base_UserInfo user = Tools.SessionHelper.GetSession<Base_UserInfo>(Tools.SessionHelper.SessinoName.CurUser);
            if (user == null)
                return new List<Base_ModuleInfo>();
            string orgOID = user.Orgs.FirstOrDefault().OID;
            List<Base_ModuleInfo> moduleList=new List<Base_ModuleInfo>();
            //缓存Key值
            string cacheKey = user.OID + orgOID + "_UserAuthModule";
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
                moduleList = _authBll.GetAllowModuleByUser(user.OID, orgOID);
                if (moduleList.Count > 0)
                    CacheHelper.SaveLocalCache(null, TimeSpan.FromHours(_authBll.CacheHour), moduleList, cacheKey);
                else
                    moduleList = new List<Base_ModuleInfo>();
            }
            #endregion

            #region 过滤结果集合
            if (moduleList != null & moduleList.Count > 0)
            {
                //转化成json串
                if (!string.IsNullOrEmpty(routeState))//如果moduleEname不为空值，代表请求某菜单下的按钮
                {
                    Base_ModuleInfo parentObj = moduleList.Where(op => op.EName == routeState).FirstOrDefault();
                    string parentModuleId = Guid.NewGuid().ToString().ToUpper();//默认给一个新创建的Guid
                    if (parentObj != null)
                    {
                        parentModuleId = parentObj.OID; //更改Guid值
                    }
                    //Base_ModuleInfo item = null;
                    moduleList = moduleList.Where(op => op.Flag == flag).Where(op => op.ParentOID == parentModuleId.ToString()).ToList();
                        //.Select(item => new { item.Name, item.PathHandler }).ToList();
                }
            }
            #endregion
            List<Base_ModuleInfo> returnList = new List<Base_ModuleInfo>();
            foreach (var item in moduleList)
            {
                Base_ModuleInfo module = new Base_ModuleInfo();
                module.Name = item.Name;
                module.PathHandler = item.PathHandler;
                module.Url = item.Url;
                module.EName = item.EName;
                module.Flag = item.Flag;
                module.Ico = item.Ico;
                returnList.Add(module);
            }
            return returnList;
        }
        /// <summary>
        /// 获取web.config中ExceptionRecord的值
        /// </summary>
        /// <returns></returns>
        public string GetWebConfig()
        {
            return System.Web.Configuration.WebConfigurationManager.AppSettings["ExceptionRecord"].ToLower();
        }
        #endregion
        #region 测试方法
        public int GETTestException()
        {
            StringBuilder sb = null;
            sb.Append("aaa");
            return 1;           
        }
        #endregion 
    }
}
