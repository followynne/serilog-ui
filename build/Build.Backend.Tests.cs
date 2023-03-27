using System.Linq;
using Nuke.Common;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.Docker;
using Nuke.Common.Tools.DotNet;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

partial class Build : NukeBuild
{
    [PackageExecutable(
        packageId: "dotnet-coverage",
        packageExecutable: "DotnetCoverage.dll",
        // Must be set for tools shipping multiple versions
        Framework = "net7.0"
    )]
    readonly Tool DotnetCoverage;

    Target Backend_Test => _ => _
        .DependsOn(Backend_Compile)
        .Requires(() => DockerTasks.DockerInfo(new DockerInfoSettings()).Any())
        .Executes(() =>
        {
            DotNetTest(s => s
                .SetProjectFile(Solution)
                .SetNoBuild(true));
        });

    Target Backend_Test_Ci => _ => _
        .DependsOn(Backend_Compile)
        .Requires(() => DockerTasks.DockerInfo(new DockerInfoSettings()).Any())
        .Executes(() =>
        {
            DotnetCoverage?.Invoke("dotnet-coverage collect -f xml -o \"coverage.xml\" dotnet test --no-build --logger \"trx;LogFileName=test-results.trx\"");
        });
}