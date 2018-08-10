using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using Domain.ADUIT;
using NHibernate;
using WorkflowService.Init;
using Domain.SystemManage;

namespace WorkflowService.OrderFlow
{

    public sealed class JudgeAduit : CodeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> OrderOID { get; set; }
        public InArgument<string> OrderBatch { get; set; }
        public OutArgument<bool> IsNext { get; set; }
        // 如果活动返回值，则从 CodeActivity<TResult>
        // 派生并从 Execute 方法返回该值。
        protected override void Execute(CodeActivityContext context)
        {
            bool isNext = false;
            ISession session = SessionFactory.GetCurrentSession();
            ITransaction tr = session.BeginTransaction();
            // 获取 Text 输入参数的运行时值
            string OrderOID = context.GetValue(this.OrderOID);
            string BatchOID = context.GetValue(this.OrderBatch);
            IList<COMMON_AUDITRECORD> AduitList = session.QueryOver<COMMON_AUDITRECORD>().Where(t => t.ADUITBATCH == BatchOID).List<COMMON_AUDITRECORD>();
            if (AduitList.Count==3)
            {
                isNext = AduitList.Where(t => t.OPERATIONRESULT == "1").Count() == 3;
            }
            context.SetValue(IsNext, isNext);
        }
    }
}
