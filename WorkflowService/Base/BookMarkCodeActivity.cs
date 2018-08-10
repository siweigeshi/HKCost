using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Activities;

namespace WorkflowService.Base
{

    public sealed class BookMarkCodeActivity : NativeActivity
    {
        // 定义一个字符串类型的活动输入参数
        public InArgument<string> BookMarkName { get; set; }
        //定义一个输出参数，用来做流程判断，相当于模拟用户处理流程节点的操作
        public OutArgument<int> Num { get; set; }

        // 创建一个BookMark，让流程停下来
        protected override void Execute(NativeActivityContext context)
        {
            // 1.获取BookMark名称
            string strBookMarkName = context.GetValue(BookMarkName);
            // 2.创建BookMark
            context.CreateBookmark(strBookMarkName,new BookmarkCallback(PreExecuteWorkFlow));
        }
        /// <summary>
        /// 注意，一定要记得注意重写此属性，并返回true，否则后面运行会报错
        /// </summary>
        protected override bool CanInduceIdle
        {
            get
            {
                return true;// base.CanInduceIdle;
            }
        }
        /// <summary>
        /// 继续执行下一个状态前，必须先执行该方法。
        /// </summary>
        /// <param name="context"></param>
        /// <param name="bookmark">书签</param>
        /// <param name="value">传递过来的值</param>
        public void PreExecuteWorkFlow(NativeActivityContext context, Bookmark bookmark, object value)
        {
            //context.SetValue(Num, Convert.ToInt32(value));
        }
    }
}
