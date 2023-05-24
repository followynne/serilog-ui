using FluentAssertions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Ui.Web.Tests.Utilities;
using Xunit;

namespace Serilog.Ui.Web.Tests.Authorization;

[Trait("Ui-Authorization", "Web")]
public class AuthorizationFilterDefaultTest : IClassFixture<WebAppFactory.Default>
{
    private readonly HttpClient _client;

    public AuthorizationFilterDefaultTest(WebAppFactory.Default factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Local_Requests_Are_Allowed_By_Default()
    {
        // Act
        var response = await _client.GetAsync("/serilog-ui/index.html");
        var result = response.EnsureSuccessStatusCode;

        // Assert
        result.Should().NotThrow<HttpRequestException>();
    }
}

[Trait("Ui-Authorization", "Web")]
public class AuthorizationFilterWithUserImplementationTest : IClassFixture<WebAppFactory.WithForbiddenLocalRequest>
{
    private readonly HttpClient _client;

    public AuthorizationFilterWithUserImplementationTest(WebAppFactory.WithForbiddenLocalRequest factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Local_Requests_Are_Not_Allowed()
    {
        // Act
        var response = await _client.GetAsync("/serilog-ui/index.html");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}