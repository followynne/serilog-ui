﻿using MySql.Tests.Util;
using Serilog.Ui.Common.Tests.TestSuites.Impl;
using Serilog.Ui.MySqlProvider;
using Xunit;

namespace MySql.Tests.DataProvider.MariaDb
{
    [Collection(nameof(MariaDbDataProvider))]
    [Trait("Integration-Search", "MariaDb")]
    public class DataProviderSearchTest : IntegrationSearchTests_Sink<MariaDbTestProvider>
    {
        public DataProviderSearchTest(MariaDbTestProvider instance) : base(instance)
        {
        }
    }
}