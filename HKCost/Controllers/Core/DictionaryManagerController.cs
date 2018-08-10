using BLL.Interfaces.IBase;
using BLL.Interfaces.IBusiness.ICore;
using Common.CommonClass;
using Common.QueryHelper;
using Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace HKCost.Controllers.Core
{
    /// <summary>
    /// 数据字典管理
    /// </summary>
    public class DictionaryManagerController : ApiController
    {
        #region 属性定义
        #endregion

        #region BLL的IoC映射
        private readonly IDictionaryBLL _service;
        public DictionaryManagerController(IDictionaryBLL _bll)
        {
            _service = _bll;
        }
        #endregion

        #region 业务方法
        /// <summary>
        /// 获取字典数据
        /// </summary>
        /// <param name="page"></param>
        /// <param name="limit"></param>
        /// <param name="swhere"></param>
        /// <param name="sort"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public object GetModelsList(int page, int limit, string swhere, string sort, string type)
        {
            PageParameter pagePara = new PageParameter() { PageIndex = page, Limit = limit, Swhere = swhere, Sort = sort, ObjName = "dictionarys" };
            return _service.GetModelsList(pagePara);
        }
        /// <summary>
        /// 新增或保存
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        public bool PostSave(PostClass PostClass)
        {
            return _service.SaveOrUpdate(PostClass);
        }
        [HttpPost]
        /// <summary>
        /// 删除，批量删除
        /// </summary>
        /// <param name="PostClass"></param>
        /// <returns></returns>
        public object Delete(PostClass PostClass)
        {
            return _service.Delete(PostClass);
        } 
        #endregion
    }
}