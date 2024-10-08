﻿using System;
using System.Linq;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Serilog.Ui.Core;
using Serilog.Ui.Core.Extensions;
using Serilog.Ui.Core.Models.Options;
using Serilog.Ui.MongoDbProvider;
using Serilog.Ui.MongoDbProvider.Extensions;
using Serilog.Ui.Web.Extensions;
using Xunit;

namespace MongoDb.Tests.Extensions
{
    [Trait("DI-DataProvider", "MongoDb")]
    public class SerilogUiOptionBuilderExtensionsTest
    {
        private readonly ServiceCollection _serviceCollection = [];

        [Fact]
        public void It_registers_provider_and_dependencies_with_connection_string_and_collection()
        {
            _serviceCollection.AddSerilogUi(builder =>
            {
                builder.UseMongoDb(options => options
                    .WithConnectionString("mongodb://mongodb0.example.com:27017/my-db")
                    .WithCollectionName("my-collection"));
            });
            var services = _serviceCollection.BuildServiceProvider();

            services.GetRequiredService<IDataProvider>().Should().NotBeNull().And.BeOfType<MongoDbDataProvider>();
            services.GetRequiredService<IMongoClient>().Should().NotBeNull();

            var providersOptions = services.GetRequiredService<ProvidersOptions>();
            providersOptions.DisabledSortProviderNames.Should().BeEmpty();
            providersOptions.ExceptionAsStringProviderNames.Should().BeEmpty();
        }

        [Fact]
        public void It_registers_provider_and_dependencies_with_connection_string_collection_and_dbname()
        {
            _serviceCollection.AddSerilogUi(builder =>
            {
                builder.UseMongoDb(options => options
                    .WithConnectionString("mongodb://mongodb0.example.com:27017/")
                    .WithDatabaseName("my-db")
                    .WithCollectionName("my-collection"));
            });
            var services = _serviceCollection.BuildServiceProvider();

            services.GetRequiredService<IDataProvider>().Should().NotBeNull().And.BeOfType<MongoDbDataProvider>();
            services.GetRequiredService<IMongoClient>().Should().NotBeNull();
            services.GetRequiredService<IMongoClient>().Settings.ApplicationName.Should().BeNullOrWhiteSpace();

            var providersOptions = services.GetRequiredService<ProvidersOptions>();
            providersOptions.DisabledSortProviderNames.Should().BeEmpty();
            providersOptions.ExceptionAsStringProviderNames.Should().BeEmpty();
        }

        [Fact]
        public void It_registers_multiple_providers()
        {
            _serviceCollection.AddSerilogUi(builder =>
            {
                builder
                    .UseMongoDb(options => options
                        .WithConnectionString("mongodb://mongodb0.example.com:27017/my-db")
                        .WithCollectionName("my-collection"))
                    .UseMongoDb(options => options
                        .WithConnectionString("mongodb://mongodb0.example.com:27017/my-db")
                        .WithCollectionName("my-collection-2"));
            });

            var serviceProvider = _serviceCollection.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();

            var providers = scope.ServiceProvider.GetServices<IDataProvider>().ToList();
            providers.Should().HaveCount(2).And.AllBeOfType<MongoDbDataProvider>();
            providers.Select(p => p.Name).Should().OnlyHaveUniqueItems();

            var providersOptions = serviceProvider.GetRequiredService<ProvidersOptions>();
            providersOptions.DisabledSortProviderNames.Should().BeEmpty();
            providersOptions.ExceptionAsStringProviderNames.Should().BeEmpty();
        }

        [Fact]
        public void It_registers_IMongoClient_only_when_not_registered()
        {
            _serviceCollection.AddSingleton<IMongoClient>(_ =>
                new MongoClient(new MongoClientSettings { ApplicationName = "my-app" }));
            _serviceCollection.AddSerilogUi(builder =>
            {
                builder.UseMongoDb(options => options
                    .WithConnectionString("mongodb://mongodb0.example.com:27017/")
                    .WithDatabaseName("my-db")
                    .WithCollectionName("my-collection"));
            });
            var services = _serviceCollection.BuildServiceProvider();

            services.GetRequiredService<IMongoClient>().Settings.ApplicationName.Should().Be("my-app");
        }

        [Fact]
        public void It_throws_on_invalid_registration()
        {
            var act = () => _serviceCollection.AddSerilogUi(builder => builder.UseMongoDb(options =>
                options.WithConnectionString("mongodb://mongodb0.example.com0:27017").WithCollectionName("name")));
            act.Should().ThrowExactly<ArgumentNullException>();
        }
    }
}