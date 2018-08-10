using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using NHibernate;
using WorkflowService.Init;
using Domain.CTOR;

namespace WorkflowService.OrderFlow
{

    public sealed class RevokeOrder : CodeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> OrderOID { get; set; }

        // 如果活动返回值，则从 CodeActivity<TResult>
        // 派生并从 Execute 方法返回该值。
        protected override void Execute(CodeActivityContext context)
        {
            // 获取 Text 输入参数的运行时值
            string OrderOID = context.GetValue(this.OrderOID);
            ISession session = SessionFactory.GetCurrentSession();
            ITransaction tr = session.BeginTransaction();
            CTOR_ORDER order = session.QueryOver<CTOR_ORDER>().Where(t => t.OID == OrderOID).List<CTOR_ORDER>().FirstOrDefault();
            order.CURSTATE = 6;
            order.DATASTATE = "";
            session.SaveOrUpdate(order);
            session.Flush();
            tr.Commit();
        }
    }
}
