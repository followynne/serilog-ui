using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Sinks.InMemory;
using Serilog.Ui.Web;
using Serilog.Ui.Web.Endpoints;
using Serilog.Ui.Web.Tests.Authorization;
using System.IO;
using System.Threading.Tasks;
using Ui.Web.Tests.Utilities.InMemoryDataProvider;

namespace Ui.Web.Tests.Utilities;

public class WebSampleProgramDefaultFactory : WebApplicationFactory<WebSampleProgram>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder
            .UseWebRoot(Directory.GetCurrentDirectory())
            .UseTestServer()
            .ConfigureServices(services =>
            {
                services.AddEndpointsApiExplorer();
                Log.Logger = new LoggerConfiguration().WriteTo.InMemory().CreateLogger();
                services.AddSerilogUi(options => options.UseInMemory());
            })
            .ConfigureTestServices(WithTestServices)
            .Configure(WithCustomConfigure);
    }

    protected virtual void WithTestServices(IServiceCollection services) { }
    protected virtual void WithCustomConfigure(IApplicationBuilder builder)
    {
        builder.UseSerilogUi();
    }
}

public class WebSampleProgramWithTestServices : WebSampleProgramDefaultFactory
{
    protected override void WithTestServices(IServiceCollection services)
    {
        // mock some services
        services.AddScoped<ISerilogUiAppRoutes, FakeAppRoutes>();
    }

    private class FakeAppRoutes : ISerilogUiAppRoutes
    {
        public UiOptions? Options { get; set; }
        public Task GetHome(HttpContext httpContext)
        {
            httpContext.Response.StatusCode = 418;
            return Task.CompletedTask;
        }
        public Task RedirectHome(HttpContext httpContext) => Task.CompletedTask;
        public void SetOptions(UiOptions options) => Options = options;
    }
}

public class WebSampleProgramWithForbiddenLocalRequest : WebSampleProgramDefaultFactory
{
    protected override void WithCustomConfigure(IApplicationBuilder builder)
    {
        builder.UseSerilogUi(options =>
        {
            options.Authorization.AuthenticationType = AuthenticationType.Jwt;
            options.Authorization.Filters = new[]
            {
                        new ForbidLocalRequestFilter()
                    };
        });
    }
}

public class WebSampleProgram
{
    protected WebSampleProgram() { }

    internal static void Main()
    {
        var builder = WebApplication.CreateBuilder();
        var app = builder.Build();
        app.Run();
    }
}
