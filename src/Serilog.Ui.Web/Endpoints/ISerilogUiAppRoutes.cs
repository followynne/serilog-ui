using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Serilog.Ui.Web.Endpoints
{
    public interface ISerilogUiAppRoutes
    {
        Task GetHome(HttpContext httpContext, UiOptions options);

        Task RedirectHome(HttpContext httpContext);
    }
}
