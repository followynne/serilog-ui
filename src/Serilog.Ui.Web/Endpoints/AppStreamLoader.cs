﻿using System.IO;

namespace Serilog.Ui.Web.Endpoints
{
    internal interface IAppStreamLoader
    {
        Stream GetIndex();
    }
    internal class AppStreamLoader : IAppStreamLoader
    {
        private const string AppManifest = "Serilog.Ui.Web.wwwroot.dist.index.html";
        public Stream GetIndex() =>
            typeof(AuthorizationOptions)
            .Assembly
            .GetManifestResourceStream(AppManifest);
    }
}
