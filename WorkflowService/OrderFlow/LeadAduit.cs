using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;
using WorkflowService.Base;

namespace WorkflowService.OrderFlow
{

    public sealed class LeadAduit : CodeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> OrderOID { get; set; }
        public InArgument<bool> IsAgree { get; set; }
        public InArgument<string> AduitContext { get; set; }
        public InArgument<string> Operator { get; set; }
        public OutArgument<bool> IsNext { get; set; }

        // 如果活动返回值，则从 CodeActivity<TResult>
        // 派生并从 Execute 方法返回该值。
        protected override void Execute(CodeActivityContext context)
        {
            AduitTableHelp.Add(context.GetValue(AduitContext), context.GetValue(IsAgree), context.GetValue(OrderOID), context.GetValue(Operator));
            context.SetValue(IsNext, context.GetValue(IsAgree));
        }
    }
}
