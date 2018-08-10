using BLL.Interfaces.IBase;
using Common.CommonClass;
using Common.QueryHelper;
using Domain.Core;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
namespace WebFrame.Controllers.Core
{
    /// <summary>
    /// 按钮码表管理
    /// </summary>
    public class ButtonsManagerController : ApiController
    {
        #region 属性定义
        List<string> igorelist = new List<string>();//当前集合需要过滤的字段
        #endregion

        #region BLL的IoC映射
        private readonly IReadWriteBLL<Base_Buttons> _service;
        public ButtonsManagerController (IReadWriteBLL<Base_Buttons> _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取全部按钮数据
        /// </summary>
        /// <returns></returns>
        public object GetButtonsList ()
        {
            return Common.NewtonJsonHelper.Deserialize<object>(Common.NewtonJsonHelper.Serialize(_service.All(), null), null);
        }
        /// <summary>
        /// 按钮列表分页
        /// </summary>
        /// <param name="page">当前页</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="swhere">筛选条件</param>
        /// <param name="sort">排序字段</param>
        /// <returns></returns>
        public object GetButtonsList (int page, int limit, string swhere, string sort)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjSql = "from Base_Buttons", ObjName = "buttons", Igorelist = null };
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
            Base_Buttons permission_new = Common.NewtonJsonHelper.Deserialize<Base_Buttons>(PostClass.PostData.ToString(), null);

            return _service.SaveOrUpdate(permission_new);
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
        #endregion

    }
}
