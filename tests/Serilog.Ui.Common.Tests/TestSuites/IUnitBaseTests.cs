﻿namespace Serilog.Ui.Common.Tests.TestSuites
{
    public interface IUnitBaseTests
    {
        void It_throws_when_any_dependency_is_null();
        void It_logs_and_throws_when_db_read_breaks_down();
    }
}
