using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public static class IdentitySeed
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Seed Role
            const string adminRoleName = "Admin";
            const string userRoleName = "User";

            if (!await roleManager.RoleExistsAsync(adminRoleName))
            {
                var role = new ApplicationRole { Name = adminRoleName };
                var roleResult = await roleManager.CreateAsync(role);
                if (!roleResult.Succeeded)
                    throw new Exception(string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            }
            if (!await roleManager.RoleExistsAsync(userRoleName))
            {
                var role = new ApplicationRole { Name = userRoleName };
                var roleResult = await roleManager.CreateAsync(role);
                if (!roleResult.Succeeded)
                    throw new Exception(string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            }

            // Seed User
            var adminEmail = "vuongphanphanvuong@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };
                var userResult = await userManager.CreateAsync(adminUser, "Admin@12345");
            }
        }
    }
}
