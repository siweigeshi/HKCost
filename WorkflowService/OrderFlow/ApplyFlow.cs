using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using Domain.CTOR;
using NHibernate;
using WorkflowService.Init;
using Domain.ADUIT;

namespace WorkflowService.OrderFlow
{

    public sealed class ApplyFlow : CodeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> OrderOID { get; set; }
        public OutArgument<string> AduitBatch { get; set; }
        // 如果活动返回值，则从 CodeActivity<TResult>
        // 派生并从 Execute 方法返回该值。
        protected override void Execute(CodeActivityContext context)
        {
            ISession session = SessionFactory.GetCurrentSession();
            ITransaction tr = session.BeginTransaction();
            string orderOID = context.GetValue(this.OrderOID);
            CTOR_ORDER order = session.QueryOver<CTOR_ORDER>().Where(t => t.OID == orderOID).List<CTOR_ORDER>().FirstOrDefault();
            if (order!=null)
            {
                order.CURSTATE = 1;
                order.DATASTATE = "0";
                order.ADUITBATCH = Guid.NewGuid().ToString();
                session.SaveOrUpdate(order);
                session.Flush();
                tr.Commit();
            }
        }
    }
}