using System;
using System.Activities;
using System.Activities.DurableInstancing;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace WorkflowService.Base
{
    public class WorkFlowHelper
    {
        static readonly string ConnStr = @"Server=192.168.0.6;database=EXHIBITION;uid=sa;pwd=123456";
        SqlWorkflowInstanceStore store = new SqlWorkflowInstanceStore(ConnStr);
        AutoResetEvent syncEvent = new AutoResetEvent(false);
        public bool FlowStart(string OrderOID)
        {
            try
            {
                WorkflowApplication app = new WorkflowApplication(new WorkflowService.OrderFlow.OrderFlow(), new Dictionary<string, object>() { {"OID",OrderOID} });

                app.InstanceStore = store;
                WorkFlowEvent(app, syncEvent);
                app.Run();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public  void RunWorkflow(Guid WorkOID)
        {
            WorkflowApplication appliacation = new WorkflowApplication(new WorkflowService.OrderFlow.OrderFlow());

            appliacation.InstanceStore = store;
            appliacation.Load(WorkOID);

            appliacation.ResumeBookmark("WaitForManager", WorkOID);

            appliacation.PersistableIdle = (e) =>
            {
                return PersistableIdleAction.Unload;
            };


        }
        private void WorkFlowEvent(WorkflowApplication app, AutoResetEvent syncEvent)
        {
            #region 工作流生命周期事件
            app.Unloaded = delegate(WorkflowApplicationEventArgs er)
            {
                //Console.WriteLine("工作流 {0} 卸载.", er.InstanceId);
            };
            app.Completed = delegate(WorkflowApplicationCompletedEventArgs er)
            {
                //Console.WriteLine("工作流 {0} 完成.", er.InstanceId);
                //syncEvent.Set();
            };
            app.Aborted = delegate(WorkflowApplicationAbortedEventArgs er)
            {
                //Console.WriteLine("工作流 {0} 终止.", er.InstanceId);
            };
            app.Idle = delegate(WorkflowApplicationIdleEventArgs er)
            {
                //Console.WriteLine("工作流 {0} 空闲.", er.InstanceId);
                syncEvent.Set(); //这里要唤醒，不让的话，当创建了一个书签之后，界面就卡死了。
            };
            app.PersistableIdle = delegate(WorkflowApplicationIdleEventArgs er)
            {
                //Console.WriteLine("持久化");
                return PersistableIdleAction.Unload;
            };
            app.OnUnhandledException = delegate(WorkflowApplicationUnhandledExceptionEventArgs er)
            {
                //Console.WriteLine("OnUnhandledException in Workflow {0}\n{1}",  er.InstanceId, er.UnhandledException.Message);
                return UnhandledExceptionAction.Terminate;
            };
            #endregion
        }
    }
}