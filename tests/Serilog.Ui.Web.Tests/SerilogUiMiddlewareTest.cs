using FluentAssertions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Ui.Web.Tests.Utilities;
using Xunit;

namespace Ui.Web.Tests
{
    [Trait("Ui-Middleware", "Web")]
    public class SerilogUiMiddlewareTest :
        IClassFixture<WebAppFactory.WithMocks>,
        IClassFixture<WebAppFactory.WithMocks.AndCustomOptions>
    {
        private readonly HttpClient httpClient;
        private readonly HttpClient httpClientWithCustomOpts;

        public SerilogUiMiddlewareTest(WebAppFactory.WithMocks program, WebAppFactory.WithMocks.AndCustomOptions programOpts)
        {
            httpClient = program.CreateClient();
            httpClientWithCustomOpts = programOpts.CreateClient();
        }

        [Theory]
        [InlineData("/serilog-ui/api/keys/")]
        [InlineData("/serilog-ui/api/logs/")]
        [InlineData("/serilog-ui/")]
        [InlineData("/serilog-ui/index.html")]
        public async Task It_hits_ui_endpoint_when_request_matches_method_and_options_prefix(string pathReq)
        {
            var send = await httpClient.GetAsync(pathReq);

            send.StatusCode.Should().Be((HttpStatusCode)418);
        }

        [Theory]
        [InlineData("/test/api/keys/")]
        [InlineData("/test/api/logs/")]
        [InlineData("/test/")]
        [InlineData("/test/index.html")]
        public async Task It_hits_ui_endpoint_when_request_matches_method_and_custom_options_prefix(string pathReq)
        {
            var send = await httpClientWithCustomOpts.GetAsync(pathReq);

            send.StatusCode.Should().Be((HttpStatusCode)418);
        }

        [Theory]
        [InlineData("fake-prefix/api/keys/")]
        [InlineData("fake-prefix/api/logs/")]
        [InlineData("/fake-prefix/")]
        [InlineData("/fake-prefix/index.html")]
        public async Task It_proceeds_onwards_when_request_does_not_match_options_prefix(string pathReq)
        {
            var send = await httpClient.GetAsync(pathReq);

            send.StatusCode.Should().NotBe((HttpStatusCode)418);
        }

        [Theory]
        [InlineData("/serilog-ui/api/keys/")]
        [InlineData("/serilog-ui/api/logs/")]
        [InlineData("/serilog-ui/")]
        [InlineData("/serilog-ui/index.html")]
        public async Task It_proceeds_onwards_when_request_is_not_a_get(string pathReq)
        {
            var methods = new HttpMethod[] {
                HttpMethod.Connect, HttpMethod.Delete, HttpMethod.Head, HttpMethod.Options,
                HttpMethod.Patch, HttpMethod.Post, HttpMethod.Put, HttpMethod.Trace,
            };

            foreach (var method in methods)
            {
                var requestMsg = new HttpRequestMessage(method, pathReq);
                var send = await httpClient.SendAsync(requestMsg);

                send.StatusCode.Should().NotBe((HttpStatusCode)418);
            }
        }
    }
}