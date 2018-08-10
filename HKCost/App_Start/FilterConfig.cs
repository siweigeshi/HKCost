using System.Web.Mvc;
using HKCost.App_Start;

namespace HKCost
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            //filters.Add(new HandleErrorAttribute() { View = "~/Views/Error/DefaultError.html" });
        }
    }
}
