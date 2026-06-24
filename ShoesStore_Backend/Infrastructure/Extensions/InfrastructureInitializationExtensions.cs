using Infrastructure.Identity;

namespace Infrastructure;

public static class InfrastructureInitializationExtensions
{
    public static Task InitialiseInfrastructureAsync(
        this IServiceProvider services)
    {
        return IdentitySeed.SeedAsync(services);
    }
}
