using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WorkflowService.Model
{
    /// <summary>
    /// 工作流实体
    /// </summary>
    public class Flow
    {
        /// <summary>
        ///  工作流书签名称
        /// </summary>
        public string BookName { get; set; }
        /// <summary>
        /// 工作流实例ID
        /// </summary>
        public Guid WorkOID { get; set; }
        /// <summary>
        /// 工作流进行步棸
        /// </summary>
        public int StepTime { get; set; }
    }
}