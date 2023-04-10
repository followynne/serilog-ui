using Microsoft.AspNetCore.Http;
using Serilog.Ui.Web.Authorization;
using System.Text;
using System.Threading.Tasks;

namespace Serilog.Ui.Web.Endpoints
{
    internal class SerilogUiAppRoutesDecorator : ISerilogUiAppRoutes
    {
        private readonly ISerilogUiAppRoutes _decoratedService;
        private readonly IAuthorizationFilterService _authFilterService;

        public SerilogUiAppRoutesDecorator(ISerilogUiAppRoutes decoratedService, IAuthorizationFilterService authFilterService)
        {
            _decoratedService = decoratedService;
            _authFilterService = authFilterService;
        }

        public Task GetHome(HttpContext httpContext, UiOptions options)
        {
            var changeResponse = (HttpResponse response) =>
            {
                response.ContentType = "text/html;charset=utf-8";
                return response.WriteAsync("<p>You don't have enough permission to access this page!</p>", Encoding.UTF8);
            };

            return _authFilterService.CheckAccess(httpContext, (context) => _decoratedService.GetHome(context, options), changeResponse);
        }

        public Task RedirectHome(HttpContext httpContext)
        {
            return _authFilterService.CheckAccess(httpContext, _decoratedService.RedirectHome);
        }
    }

    internal class SerilogUiEndpointsDecorator : ISerilogUiEndpoints
    {
        private readonly ISerilogUiEndpoints _decoratedService;
        private readonly IAuthorizationFilterService _authFilterService;

        public SerilogUiEndpointsDecorator(ISerilogUiEndpoints decoratedService, IAuthorizationFilterService authFilterService)
        {
            _decoratedService = decoratedService;
            _authFilterService = authFilterService;
        }

        public Task GetApiKeys(HttpContext httpContext)
        {
            return _authFilterService.CheckAccess(httpContext, _decoratedService.GetApiKeys);
        }

        public Task GetLogs(HttpContext httpContext)
        {
            return _authFilterService.CheckAccess(httpContext, _decoratedService.GetLogs);
        }
    }
}
