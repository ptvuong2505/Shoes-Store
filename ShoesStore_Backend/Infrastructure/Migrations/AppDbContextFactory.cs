using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Migrations
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{env}.json", optional: true)
                .Build();

            var conn = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(conn))
                throw new Exception("DefaultConnection is missing");

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseNpgsql(conn)
                .Options;

            return new AppDbContext(options);
        }
    }
}
