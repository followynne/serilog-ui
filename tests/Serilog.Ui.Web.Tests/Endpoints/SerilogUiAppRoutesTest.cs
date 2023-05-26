using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Serilog.Ui.Web.Endpoints;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Ui.Web.Tests.Endpoints
{
    [Trait("Ui-Api-Routes", "Web")]
    public class SerilogUiAppRoutesTest
    {
        private readonly SerilogUiAppRoutes sut;
        private readonly DefaultHttpContext testContext;

        public SerilogUiAppRoutesTest()
        {
            testContext = new DefaultHttpContext();
            testContext.Request.Host = new HostString("test.dev");
            testContext.Request.Scheme = "https";
            sut = new SerilogUiAppRoutes();
        }

        [Fact]
        public async Task It_gets_app_home()
        {
            sut.SetOptions(new());
            testContext.Request.Path = "/serilog-ui-url/index.html";

            await sut.GetHome(testContext);

            testContext.Response.StatusCode.Should().Be(200);
            testContext.Response.ContentType.Should().Be("TODO: to-be-implemented");
        }

        [Fact]
        public async Task It_redirects_app_home()
        {
            testContext.Request.Path = "/serilog-ui-url/";
            await sut.RedirectHome(testContext);

            testContext.Response.StatusCode.Should().Be(301);
            testContext.Response.Headers.Location.First().Should().Be("https://test.dev/serilog-ui-url/index.html");
        }

        [Fact]
        public Task It_throws_on_app_home_if_ui_options_were_not_set()
        {
            var result = () => sut.GetHome(new DefaultHttpContext());

            return result.Should().ThrowAsync<ArgumentNullException>();
        }
    }
}
