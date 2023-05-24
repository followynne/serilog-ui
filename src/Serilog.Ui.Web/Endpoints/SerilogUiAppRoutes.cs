using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using Newtonsoft.Json.Serialization;
using Ardalis.GuardClauses;

namespace Serilog.Ui.Web.Endpoints
{
    internal class SerilogUiAppRoutes : ISerilogUiAppRoutes
    {
        private readonly JsonSerializerSettings _jsonSerializerOptions;

        public SerilogUiAppRoutes()
        {
            _jsonSerializerOptions = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.None
            };
        }

        public UiOptions Options { get; private set; }

        public async Task GetHome(HttpContext httpContext)
        {
#if NET6_0_OR_GREATER
            Guard.Against.Null(Options);
#else
            Guard.Against.Null(Options, nameof(Options));
#endif
            var response = httpContext.Response;

            await using var stream = IndexStream();
            if (stream is null)
            {
                await response.WriteAsync("<div>Server error while loading assets. Please contact administration.</div>", Encoding.UTF8);
                return;
            }

            var htmlString = await LoadStream(stream, Options);
            response.StatusCode = 200;
            response.ContentType = "text/html;charset=utf-8";

            await response.WriteAsync(htmlString, Encoding.UTF8);
        }

        public Task RedirectHome(HttpContext httpContext)
        {
            var indexUrl = httpContext.Request.GetEncodedUrl().TrimEnd('/') + "/index.html";

            httpContext.Response.StatusCode = 301;
            httpContext.Response.Headers["Location"] = indexUrl;

            return Task.CompletedTask;
        }

        public void SetOptions(UiOptions options)
        {
            Options = options;
        }

        // TODO move outside to safely mock it
        private Func<Stream> IndexStream { get; } = () =>
            typeof(AuthorizationOptions)
            .GetTypeInfo()
            .Assembly
            .GetManifestResourceStream("Serilog.Ui.Web.wwwroot.dist.index.html");

        private async Task<string> LoadStream(Stream stream, UiOptions options)
        {
            var htmlStringBuilder = new StringBuilder(await new StreamReader(stream).ReadToEndAsync());
            var authType = options.Authorization.AuthenticationType.ToString();
            var encodeAuthOpts = Uri.EscapeDataString(JsonConvert.SerializeObject(new { options.RoutePrefix, authType, options.HomeUrl }, _jsonSerializerOptions));

            htmlStringBuilder
                .Replace("%(Configs)", encodeAuthOpts)
                .Replace("<meta name=\"dummy\" content=\"%(HeadContent)\">", options.HeadContent)
                .Replace("<meta name=\"dummy\" content=\"%(BodyContent)\">", options.BodyContent);

            return htmlStringBuilder.ToString();
        }
    }
}
