using NHibernate;

namespace WorkflowService.Init
{
    /// <summary>
    /// 继承EmptyInterceptor类，实现生成sql日志配置（添加到SessionFactory配置中即可，具体参见SessionFactory.cs）
    /// </summary>
    public class SqlStatementInterceptor : EmptyInterceptor
    {
        public override NHibernate.SqlCommand.SqlString OnPrepareStatement(NHibernate.SqlCommand.SqlString sql)
        {
            System.Diagnostics.Trace.WriteLine(sql.ToString());
            return sql;
        }
    }
}
