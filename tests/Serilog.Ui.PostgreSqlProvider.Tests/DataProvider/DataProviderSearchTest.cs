﻿using Postgres.Tests.Util;
using Serilog.Ui.PostgreSqlProvider;
using Serilog.Ui.Common.Tests.TestSuites.Impl;
using Xunit;

namespace Postgres.Tests.DataProvider;

[Collection(nameof(PostgresDataProvider))]
[Trait("Integration-Search", "Postgres")]
public class DataProviderSearchTest(PostgresTestProvider instance) : IntegrationSearchTests<PostgresTestProvider>(instance);