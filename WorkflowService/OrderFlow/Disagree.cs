using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using WorkflowService.Init;
using NHibernate;
using Domain.CTOR;

namespace WorkflowService.OrderFlow
{

    public sealed class Disagree : CodeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> OrderOID { get; set; }
        public OutArgument<string> OrderBatch { get; set; }

        // 如果活动返回值，则从 CodeActivity<TResult>
        // 派生并从 Execute 方法返回该值。
        protected override void Execute(CodeActivityContext context)
        {
            // 获取 Text 输入参数的运行时值
            string CtorOrderOID = context.GetValue(this.OrderOID);
            ISession session = SessionFactory.GetCurrentSession();
            ITransaction tr = session.BeginTransaction();
            CTOR_ORDER Order = session.QueryOver<CTOR_ORDER>().Where(t => t.OID == CtorOrderOID).List<CTOR_ORDER>().FirstOrDefault();
            Order.CURSTATE = 4;
            Order.DATASTATE = "1";
            Order.ADUITBATCH = Guid.NewGuid().ToString();
            session.SaveOrUpdate(Order);
            session.Flush();
            tr.Commit();
        }
    }
}
