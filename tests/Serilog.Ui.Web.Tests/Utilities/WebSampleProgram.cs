﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Sinks.InMemory;
using Serilog.Ui.Web;
using Serilog.Ui.Web.Tests.Authorization;
using Serilog.Ui.Web.Tests.SerilogInMemoryDataProvider;
using System.IO;

namespace Ui.Web.Tests.Utilities;

public class WebSampleProgram
{
    internal static void Main()
    {
        var builder = WebApplication.CreateBuilder();

        var app = builder.Build();

        app.Run();
    }
}

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
            .Configure(appBuilder =>
            {
                appBuilder.UseSerilogUi();
            });
    }

    protected virtual void WithTestServices(IServiceCollection services) { }
}

public class WebSampleProgramWithTestServices : WebSampleProgramDefaultFactory
{
    protected override void WithTestServices(IServiceCollection services)
    {
        // TODO: mock some services
    }
}

public class WebSampleProgramWithForbiddenLocalRequest : WebApplicationFactory<WebSampleProgram>
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
            .Configure(appBuilder =>
            {
                appBuilder.UseSerilogUi(options =>
                {
                    options.Authorization.AuthenticationType = AuthenticationType.Jwt;
                    options.Authorization.Filters = new[]
                    {
                        new ForbidLocalRequestFilter()
                    };
                });
            });
    }
}