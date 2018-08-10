using Domain.ADUIT;
using Domain.SystemManage;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WorkflowService.Init;

namespace WorkflowService.Base
{
    public class AduitTableHelp
    {
        public static bool Add(string AduitContext, bool IsAgree, string OrderOID,string Operator)
        {
            ISession session = SessionFactory.GetCurrentSession();
            ITransaction tr = session.BeginTransaction();
            string AduitBatch = SessionFactory.GetCurrentSession().QueryOver<COMMON_AUDITRECORD>().Where(t => t.OID == OrderOID).Select(t => t.ADUITBATCH).List<string>().FirstOrDefault();

            COMMON_AUDITRECORD Aduit = new COMMON_AUDITRECORD();
            Aduit.OPERATOR = Operator;
            Aduit.CONTENT = AduitContext;
            Aduit.OPERATIONRESULT = IsAgree ? "1" : "2";
            Aduit.TABLENAME = "CTOR_ORDER";
            Aduit.TABLEOID = OrderOID;
            Aduit.OPERATIONTIME = DateTime.Now;
            Aduit.ADUITBATCH = AduitBatch;
            session.SaveOrUpdate(Aduit);
            session.Flush();
            tr.Commit();
            session.Dispose();
            tr.Dispose();
            return true;
        }
    }
}