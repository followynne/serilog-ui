using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Serilog.Ui.Web;
using Serilog.Ui.Web.Authorization;
using Serilog.Ui.Web.Endpoints;
using Serilog.Ui.Web.Tests.Authorization;
using System.IO;
using System.Threading.Tasks;
using Xunit;

namespace Ui.Web.Tests.Endpoints
{
    [Trait("Ui-Endpoints", "Web")]
    public class SerilogUiDecoratorsTest
    {
        private readonly AuthorizationFilterService authMock;
        private readonly Mock<ISerilogUiAppRoutes> appRoutesMock;
        private readonly Mock<ISerilogUiEndpoints> endpointMock;
        private readonly SerilogUiAppRoutesDecorator sutRoutesDecorator;
        private readonly SerilogUiEndpointsDecorator sutEndpointsDecorator;

        public SerilogUiDecoratorsTest()
        {
            authMock = new AuthorizationFilterService();
            appRoutesMock = new Mock<ISerilogUiAppRoutes>();
            endpointMock = new Mock<ISerilogUiEndpoints>();
            appRoutesMock.Setup(p => p.GetHome(It.IsAny<HttpContext>()));
            appRoutesMock.Setup(p => p.RedirectHome(It.IsAny<HttpContext>()));
            endpointMock.Setup(p => p.GetLogs(It.IsAny<HttpContext>()));
            endpointMock.Setup(p => p.GetApiKeys(It.IsAny<HttpContext>()));

            sutRoutesDecorator = new SerilogUiAppRoutesDecorator(appRoutesMock.Object, authMock);
            sutEndpointsDecorator = new SerilogUiEndpointsDecorator(endpointMock.Object, authMock);
        }

        [Fact]
        public async Task It_forward_the_call_on_success_authentication()
        {
            sutRoutesDecorator.SetOptions(new());
            sutEndpointsDecorator.SetOptions(new());

            await sutRoutesDecorator.GetHome(new DefaultHttpContext());
            await sutRoutesDecorator.RedirectHome(new DefaultHttpContext());
            await sutEndpointsDecorator.GetLogs(new DefaultHttpContext());
            await sutEndpointsDecorator.GetApiKeys(new DefaultHttpContext());

            appRoutesMock.Verify(p => p.GetHome(It.IsAny<HttpContext>()), Times.Once);
            appRoutesMock.Verify(p => p.RedirectHome(It.IsAny<HttpContext>()), Times.Once);
            endpointMock.Verify(p => p.GetLogs(It.IsAny<HttpContext>()), Times.Once);
            endpointMock.Verify(p => p.GetApiKeys(It.IsAny<HttpContext>()), Times.Once);
        }

        [Fact]
        public async Task It_blocks_the_call_on_failed_authentication()
        {
            var uiOpts = new UiOptions();
            uiOpts.Authorization.Filters = new IUiAuthorizationFilter[] { new ForbidLocalRequestFilter() };
            sutRoutesDecorator.SetOptions(uiOpts);
            sutEndpointsDecorator.SetOptions(uiOpts);

            var defaultHttp = new DefaultHttpContext();
            await sutRoutesDecorator.GetHome(defaultHttp);

            await sutRoutesDecorator.RedirectHome(new DefaultHttpContext());
            await sutEndpointsDecorator.GetLogs(new DefaultHttpContext());
            await sutEndpointsDecorator.GetApiKeys(new DefaultHttpContext());

            appRoutesMock.Verify(p => p.GetHome(It.IsAny<HttpContext>()), Times.Never);
            var bodyWrite = await new StreamReader(defaultHttp.Response.Body).ReadToEndAsync();
            bodyWrite.Should().Be("<p>You don't have enough permission to access this page!</p>");
            
            appRoutesMock.Verify(p => p.RedirectHome(It.IsAny<HttpContext>()), Times.Never);
            endpointMock.Verify(p => p.GetLogs(It.IsAny<HttpContext>()), Times.Never);
            endpointMock.Verify(p => p.GetApiKeys(It.IsAny<HttpContext>()), Times.Never);
        }
    }
}
