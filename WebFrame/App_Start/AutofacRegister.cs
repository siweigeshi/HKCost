using Autofac;
using System.Reflection;
namespace WebFrame.App_Start
{
    public class AutofacRegister
    {
        public void BuildRegister(ContainerBuilder builder)
        {
            builder = new ContainerBuilder();
            var DAL = Assembly.Load("DAL");
            builder.RegisterAssemblyTypes(DAL);
            var container = builder.Build();

        }
    }
}