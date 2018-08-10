using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Activities;
using System.Activities.Statements;
using System.Threading;
using System.Collections;
using System.Activities.DurableInstancing;
using System.Runtime.DurableInstancing;
using System.Activities.XamlIntegration;
using WorkflowService.Model;

namespace WorkflowService
{
    public class WorkflowHelp
    {
        public static string connString = "server=192.168.0.6;database=EXHIBITION;uid=sa;pwd=123456";
        private static SqlWorkflowInstanceStore _instanceStore;
        public static  SqlWorkflowInstanceStore InstanceStoreObj
        {
            get
            {
                if (_instanceStore == null)
                {
                    _instanceStore = new SqlWorkflowInstanceStore(connString);
                }
                return _instanceStore;
            }
            set
            {
                _instanceStore = value;
            }
        }
        /// <summary>
        /// 创建工作流
        /// </summary>
        /// <param name="flow"></param>
        /// <returns></returns>
        public static  Guid CreateWorkflow(string OrderOID)
        {
            InstanceHandle instanceHandle = InstanceStoreObj.CreateInstanceHandle();
            InstanceView view = InstanceStoreObj.Execute(instanceHandle, new CreateWorkflowOwnerCommand(), TimeSpan.FromSeconds(30));
            InstanceStoreObj.DefaultInstanceOwner = view.InstanceOwner;
            IDictionary<string, object> input = new Dictionary<string, object> 
            {
                { "OrderOID" , OrderOID }
            };

            //WorkflowApplication application = new WorkflowApplication(new AuthFlow(),input);
            WorkflowApplication application = new WorkflowApplication(new WorkflowService.OrderFlow.OrderFlow(), input);
             
            application.InstanceStore = InstanceStoreObj;
            application.PersistableIdle = (e) =>
            {
                return PersistableIdleAction.Unload;
            };
            application.Unloaded = (e) =>
            {
                 //PersistableIdleAction.Unload;
            };
            application.Run();
            var deleteOwnerCmd = new DeleteWorkflowOwnerCommand();
            //InstanceStoreObj.Execute(instanceHandle, deleteOwnerCmd, TimeSpan.FromSeconds(30));
            InstanceStoreObj = null;
            return application.Id;
        }
        /// <summary>
        /// 继续执行工作流
        /// </summary>
        /// <param name="flow"></param>
        public static void RunWorkflow(string bookName, Guid WorkFlowID, string OrderOID, bool isAgree, string Content, string Operater)
        {
            //WorkflowApplication application = new WorkflowApplication(new AuthFlow(),input);
            WorkflowApplication appliacation = new WorkflowApplication(new WorkflowService.OrderFlow.OrderFlow());
            appliacation.InstanceStore = InstanceStoreObj;
            IDictionary<string, object> input = new Dictionary<string, object> 
            {
                { "OrderOID" , OrderOID }, { "isAgree" , isAgree }, { "Content" , Content }, { "Operater" , Operater }
            };
            appliacation.Load(WorkFlowID);
            appliacation.ResumeBookmark(bookName, input);
            appliacation.PersistableIdle = (e) =>
            {
                return PersistableIdleAction.Unload;
            };
        }
    }
}
