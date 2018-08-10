using Common.CommonClass;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkflowService.Init
{
    /// <summary>
    /// 数据库连接类(FluentConfiguration NHibernate方式)
    /// 返回连接字符串
    /// 支持多种数据库连接
    /// </summary>
    public class DBConnect
    {
        /// <summary>
        /// 获取SqlServer数据库连接
        /// </summary>
        /// <returns></returns>
        public FluentConfiguration GetSqlServerConfig ()
        {
            CurrentDBConnect.CurDBConnectType=DBConnectType.SQLSERVER;
            return Fluently.Configure()
                .Database(MsSqlConfiguration.MsSql2008.ConnectionString(c => c.FromConnectionStringWithKey("RemoteSqlServer"))
                .AdoNetBatchSize(100).ShowSql())
                .Mappings(m => m.FluentMappings.AddFromAssemblyOf<Domain.EntityBase>())
                .ExposeConfiguration(f => f.SetInterceptor(new SqlStatementInterceptor()));
        }
        /// <summary>
        /// 获取Oracle数据库连接
        /// </summary>
        /// <returns></returns>
        public FluentConfiguration GetOracleConfig ()
        {
            CurrentDBConnect.CurDBConnectType=DBConnectType.ORACLE;
            return Fluently.Configure()
           .Database(OracleDataClientConfiguration.Oracle10.ConnectionString(c => c.FromConnectionStringWithKey("RemoteOracle"))
           .Provider<NHibernate.Connection.DriverConnectionProvider>()
           .Driver<NHibernate.Driver.OracleClientDriver>()
           .AdoNetBatchSize(100000000).ShowSql())
           .Mappings(m => m.FluentMappings.AddFromAssemblyOf<Domain.EntityBase>())
           .ExposeConfiguration(f => f.SetInterceptor(new SqlStatementInterceptor()));
        }
    }
}
