using Microsoft.Extensions.Logging;
using Moq;
using Serilog.Ui.Web.Endpoints;
using Xunit;

namespace Ui.Web.Tests.Endpoints
{
    [Trait("Ui-Api-Endpoints", "Web")]
    public class SerilogUiEndpointsTest
    {
        private readonly Mock<ILogger<SerilogUiEndpoints>> loggerMock;
        private readonly SerilogUiEndpoints sut;

        public SerilogUiEndpointsTest()
        {
            loggerMock = new Mock<ILogger<SerilogUiEndpoints>>();
            sut = new SerilogUiEndpoints(loggerMock.Object);
        }
    }
}
