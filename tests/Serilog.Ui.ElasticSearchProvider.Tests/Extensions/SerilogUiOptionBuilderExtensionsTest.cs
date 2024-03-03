﻿using Elastic.Elasticsearch.Xunit.XunitPlumbing;
using ElasticSearch.Tests.Util;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Serilog.Ui.Core;
using Serilog.Ui.ElasticSearchProvider;
using Serilog.Ui.Web;
using System;
using System.Collections.Generic;
using Xunit;

namespace ElasticSearch.Tests.Extensions
{
    [Trait("DI-DataProvider", "Elastic")]
    public class SerilogUiOptionBuilderExtensionsTest : IClusterFixture<Elasticsearch7XCluster>
    {
        private readonly ServiceCollection _serviceCollection = new();

        [U]
        public void It_registers_provider_and_dependencies()
        {
            _serviceCollection.AddSerilogUi((builder) =>
            {
                builder.UseElasticSearchDb(new Uri("https://elastic.example.com"), "my-index");
            });
            var services = _serviceCollection.BuildServiceProvider();

            services.GetRequiredService<IDataProvider>().Should().NotBeNull().And.BeOfType<ElasticSearchDbDataProvider>();
            var options = services.GetRequiredService<ElasticSearchDbOptions>();
            options.Should().NotBeNull();
            options.IndexName.Should().Be("my-index");
        }

        [U]
        public void It_throws_on_invalid_registration()
        {
            var uri = new Uri("https://elastic.example.com");
            var nullables = new List<Func<IServiceCollection>>
            {
                () => _serviceCollection.AddSerilogUi((builder) => builder.UseElasticSearchDb(null, "name")),
                () => _serviceCollection.AddSerilogUi((builder) => builder.UseElasticSearchDb(uri, null)),
                () => _serviceCollection.AddSerilogUi((builder) => builder.UseElasticSearchDb(uri, " ")),
                () => _serviceCollection.AddSerilogUi((builder) => builder.UseElasticSearchDb(uri, "")),
            };

            foreach (var nullable in nullables)
            {
                nullable.Should().ThrowExactly<ArgumentNullException>();
            }
        }
    }
}
