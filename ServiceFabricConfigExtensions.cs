namespace DotNet.Helpers
{
    public static class ServiceFabricConfigExtensions
    {
        public static IConfigurationBuilder AddServiceFabricConfig(this IConfigurationBuilder builder, string packageName)
        {
            return builder.Add(new ServiceFabricConfigSource(packageName));
        }

#region declarations

        private class ServiceFabricConfigSource : IConfigurationSource
        {
            private string PackageName { get; set; }

            public ServiceFabricConfigSource(string packageName)
            {
                PackageName = packageName;
            }

            public IConfigurationProvider Build(IConfigurationBuilder builder)
            {
                return new ServiceFabricConfigurationProvider(PackageName);
            }
        }

        private class ServiceFabricConfigurationProvider : ConfigurationProvider
        {
            private readonly string _packageName;
            private readonly CodePackageActivationContext _context;

            public ServiceFabricConfigurationProvider(string packageName)
            {
                _packageName = packageName;
                _context = FabricRuntime.GetActivationContext();
                _context.ConfigurationPackageModifiedEvent += (sender, e) =>
                {
                    LoadPackage(e.NewPackage, reload: true);
                    OnReload();
                };
            }

            public override void Load()
            {
                var config = _context.GetConfigurationPackageObject(_packageName);
                LoadPackage(config);
            }

            private void LoadPackage(ConfigurationPackage config, bool reload = false)
            {
                if (reload)
                {
                    Data.Clear();
                }
                foreach (var section in config.Settings.Sections)
                {
                    foreach (var param in section.Parameters)
                    {
                        Data[$"{section.Name}:{param.Name}"] = param.IsEncrypted ? ToUnsecureString(param.DecryptValue()) : param.Value;
                    }
                }
            }
        }

        private static string ToUnsecureString(SecureString secureString)
        {
            if (secureString == null)
            {
                throw new ArgumentNullException();
            }

            IntPtr unmanagedString = IntPtr.Zero;

            try
            {
                unmanagedString = Marshal.SecureStringToGlobalAllocUnicode(secureString);
                return Marshal.PtrToStringUni(unmanagedString);
            }
            finally
            {
                Marshal.ZeroFreeGlobalAllocUnicode(unmanagedString);
            }
        }

        #endregion
    }
}
