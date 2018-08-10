using Castle.DynamicProxy;
using Common;
using DAL;
using DAL.Implements.Base;
using System;
using System.Collections.Generic;

namespace HKCost.App_Start.Interceptors
{
    /// <summary>
    /// 事务拦截器
    /// 当服务执行增删改查操作的时候，开启事务，提交事务，回滚事务
    /// 通过AOP方式实现事务处理
    ///  现暂时不用
    /// </summary>
    public class TransactionInterceptor : StandardInterceptor
    {
        private readonly UnitOfWork _uow;

        public TransactionInterceptor(UnitOfWork uow)
        {
            _uow = uow;
        }

        /// <summary>
        /// 在进入拦截的方法之前调用。
        /// 预处理
        /// </summary>
        /// <param name="invocation"></param>
        protected override void PreProceed(IInvocation invocation)
        {
            base.PreProceed(invocation);
        }
        /// <summary>
        /// 在拦截的方法开始执行时候调用
        /// </summary>
        /// <param name="invocation"></param>
        protected override void PerformProceed(IInvocation invocation)
        {
            //SessionFactory.SessionBind();
            if (invocation.Method.Name.EndsWith("Add") || invocation.Method.Name.EndsWith("Update") || invocation.Method.Name.EndsWith("Delete")||invocation.Method.Name.StartsWith("Save"))
            {
                //_uow.BeginTransaction();
            }
            base.PerformProceed(invocation);
        }

        /// <summary>
        /// 在拦截的方法执行完成之后调用
        /// </summary>
        /// <param name="invocation"></param>
        protected override void PostProceed(IInvocation invocation)
        {
            if (invocation.Method.Name.EndsWith("Add") || invocation.Method.Name.EndsWith("Update") || invocation.Method.Name.EndsWith("Delete")||invocation.Method.Name.StartsWith("Save"))
            {
                try
                {
                    //_uow.Commit();
                }
                catch (Exception ex)
                {
                    //记录错误日志
                    LogHelper.WriteLog(string.Format("执行方法：{0},出错了！", invocation.Method.Name), ex);
                    //执行方法返回值为false 执行失败
                    if (invocation.ReturnValue.GetType() == typeof(bool))
                    {
                        invocation.ReturnValue = false;
                    }
                    //_uow.Rollback();
                }
                finally
                {
                    //_uow.EndTransaction();
                }
            }
            SessionFactory.SessionUnbind();
            base.PostProceed(invocation);
        }
    }
}