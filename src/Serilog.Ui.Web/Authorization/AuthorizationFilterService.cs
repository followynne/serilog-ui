using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Serilog.Ui.Web.Authorization
{
    internal interface IAuthorizationFilterService
    {
        Task CheckAccess(HttpContext httpContext,
            Func<HttpContext, Task> onSuccess,
            Func<HttpResponse, Task> onFailure = null);
    }

    internal class AuthorizationFilterService : IAuthorizationFilterService
    {
        private readonly UiOptions _options;

        public AuthorizationFilterService(UiOptions options)
        {
            _options = options;
        }

        public async Task CheckAccess(HttpContext httpContext,
            Func<HttpContext, Task> onSuccess,
            Func<HttpResponse, Task> onFailure = null)
        {
            var accessCheck = await CanAccess(httpContext);
            if (!accessCheck)
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                await onFailure?.Invoke(httpContext.Response);
                return;
            }

            await onSuccess(httpContext);
        }

        private async Task<bool> CanAccess(HttpContext httpContext)
        {
            var syncFilterResult = _options.Authorization.Filters.All(filter => filter.Authorize(httpContext));

            var asyncFilter = await Task.WhenAll(_options.Authorization.AsyncFilters.Select(filter => filter.AuthorizeAsync(httpContext)));
            var asyncFilterResult = asyncFilter.Any(filter => !filter);

            return syncFilterResult && !asyncFilterResult;
        }
    }
}
