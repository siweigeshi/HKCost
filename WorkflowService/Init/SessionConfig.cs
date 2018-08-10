using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;

namespace WorkflowService.Init
{
    public static class SessionConfig
    {
        /// <summary>
        /// 获取Hibernate配置
        /// </summary>
        /// <returns></returns>
        public static FluentConfiguration GetConfig()
        {
            DBConnect dbConnect = new DBConnect();
            return dbConnect.GetSqlServerConfig();
        }
    }
}
