﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Primitives;
using MsSql.Tests.Util;
using Serilog.Ui.Common.Tests.TestSuites;
using Serilog.Ui.Core.Extensions;
using Serilog.Ui.Core.Models;
using Serilog.Ui.MsSqlServerProvider;
using Serilog.Ui.MsSqlServerProvider.Extensions;
using Xunit;

namespace MsSql.Tests.DataProvider;

[Trait("Unit-Base", "MsSql")]
public class DataProviderBaseTest : IUnitBaseTests
{
    [Fact(Skip = "Not required")]
    public void It_throws_when_any_dependency_is_null()
        => throw new NotImplementedException();

    [Fact]
    public async Task It_logs_and_throws_when_db_read_breaks_down()
    {
        // Arrange
        SqlServerDataProvider sut = new(
            new SqlServerDbOptions("dbo").WithConnectionString("connString").WithTable("logs"),
            new SqlServerQueryBuilder<SqlServerLogModel>());

        SqlServerDataProvider<SqlServerTestModel> sutWithCols = new(
            new SqlServerDbOptions("dbo").WithConnectionString("connString").WithTable("logs"),
            new SqlServerQueryBuilder<SqlServerTestModel>());

        Dictionary<string, StringValues> query = new() { ["page"] = "1", ["count"] = "10" };

        // Act
        var assert = () => sut.FetchDataAsync(FetchLogsQuery.ParseQuery(query));
        var assertWithCols = () => sutWithCols.FetchDataAsync(FetchLogsQuery.ParseQuery(query));

        // Assert
        await assert.Should().ThrowExactlyAsync<ArgumentException>();
        await assertWithCols.Should().ThrowExactlyAsync<ArgumentException>();
    }
}