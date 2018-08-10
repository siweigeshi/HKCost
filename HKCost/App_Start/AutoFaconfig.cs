using Autofac;
using Autofac.Extras.DynamicProxy2;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using BLL.Implements.Base;
using BLL.Interfaces.IBase;
using Common;
using DAL.Implements.Base;
using System;
using System.Linq;
using System.Reflection;
using System.Web.Compilation;
using System.Web.Http;
using System.Web.Mvc;
using HKCost.App_Start.Aspects;
using HKCost.App_Start.Interceptors;

namespace HKCost.App_Start
{
    /// <summary>
    /// AutoFac IOC 配置文件【使用的是构造注入】
    /// </summary>
    public static class AutoFaconfig
    {
        /// <summary>
        /// 初始化容器
        /// </summary>
        /// <param name="config"></param>
        public static void Initialize(HttpConfiguration config)
        {
            Initialize(config, RegisterServices(new ContainerBuilder()));
        }

        /// <summary>
        /// 解析容器中的对象
        /// </summary>
        /// <param name="config"></param>
        /// <param name="container"></param>
        public static void Initialize(HttpConfiguration config, IContainer container)
        {
            //解析API容器
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            //解析MVC容器
            //DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        /// <summary>
        /// 注册服务
        /// </summary>
        /// <param name="builder"></param>
        /// <returns>容器</returns>
        private static IContainer RegisterServices(ContainerBuilder builder)
        {

            //注册事务session 管理 单例
            builder.RegisterType<UnitOfWork>().SingleInstance();

            //注册权限控制面 管理 单例
            builder.RegisterType<AuthenticationAspect>().SingleInstance();

            //注册事务拦截器
            //builder.RegisterType<TransactionInterceptor>();

            //注册事务控制面 管理 单例
            builder.RegisterType<TransactionAspect>();

            //注册Mvc Controller 权限控制拦截器
            //builder.RegisterType<SecurityByControllerInterceptor>();

            //注册Api Controller 权限控制拦截器
            builder.RegisterType<SecurityByApiControllerInterceptor>();

            //注册API容器的实现并启用权限控制拦截
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly()).EnableClassInterceptors().InterceptedBy(typeof(SecurityByApiControllerInterceptor));

            //注册MVC容器的实现
            //builder.RegisterControllers(Assembly.GetExecutingAssembly());//.EnableClassInterceptors().InterceptedBy(typeof(SecurityByControllerInterceptor));

            //获取IDependency的接口类型
            var baseType = typeof(IDependency);
            //在当前程序域中得到所有程序集dll,【注意：这种获取dll的方式自动注册业务类，系统发布IIS上时候，应用池回收之后，注册失效.】
            //var assemblys = AppDomain.CurrentDomain.GetAssemblies().ToList();

            //从ASP.NET 应用程序编译管理类中获取所有页编译都必须引用的程序集引用的列表中得到所有程序集dll,web程序用这种方式注册正常。
            var assemblys = BuildManager.GetReferencedAssemblies().Cast<Assembly>().ToList();

            #region 获取所有实现IDependency的服务
            //获取所有实现IDependency的服务BLL
            //var AllServices = assemblys
            //    .SelectMany(s => s.GetTypes())
            //    .Where(p => baseType.IsAssignableFrom(p)&&p!=baseType); 
            #endregion

            //注册所有实现IDependency的服务BLL,【并启用事务拦截器-0609关闭事务拦截器】
            builder.RegisterAssemblyTypes(assemblys.ToArray())
                   .Where(t => baseType.IsAssignableFrom(t) && t != baseType)
                   .AsImplementedInterfaces().InstancePerLifetimeScope();//.EnableInterfaceInterceptors().InterceptedBy(typeof(TransactionInterceptor));

            //注册泛型BaseBLL=》IReadWriteBLL【并启用拦截器-0609关闭事务拦截器】
            builder.RegisterGeneric(typeof(BaseBLL<>)).As(typeof(IReadWriteBLL<>));//.EnableInterfaceInterceptors().InterceptedBy(typeof(TransactionInterceptor));

            #region 其他服务注册方式
            // builder.RegisterAssemblyTypes(AppDomain.CurrentDomain.GetAssemblies())//查找程序集中以services结尾的类型
            //     .Where(t => t.Name.EndsWith("Services"))
            //     .AsImplementedInterfaces();
            // builder.RegisterAssemblyTypes(AppDomain.CurrentDomain.GetAssemblies())//查找程序集中以Repository结尾的类型
            //.Where(t => t.Name.EndsWith("Repository"))
            //.AsImplementedInterfaces(); 
            #endregion

            return builder.Build();//返回容器
        }
    }
}