using NHibernate;

namespace WorkflowService.Init
{
    public static class SessionFactory
    {
        public static ISession _session;
        public static ISessionFactory sessionFactory { get; set; }

        static SessionFactory()
        {
            CreateSessionFactory();
        }

        public static ISession GetCurrentSession()
        {
            return sessionFactory.OpenSession(); ;
        }

        /// <summary>
        /// 获取当前SessionFactory
        /// </summary>
        /// <returns></returns>
        private static ISessionFactory GetCurrentFactory()
        {
            if (sessionFactory == null)
            {
                CreateSessionFactory();
            }
            return sessionFactory;
        }

        /// <summary>
        /// 创建Session
        /// </summary>
        /// <returns></returns>
        private static void CreateSessionFactory()
        {
            sessionFactory = SessionConfig.GetConfig().BuildSessionFactory();
        }
    }
}
