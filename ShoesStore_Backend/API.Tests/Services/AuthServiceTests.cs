using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Interfaces;
using Domain.Identity;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace API.Tests.Services;

public class AuthServiceTests
{
    [Fact]
    public async Task LoginAsync_ThrowsInvalidCredentials_WhenUserDoesNotExist()
    {
        var userManager = CreateUserManager();
        userManager
            .Setup(manager => manager.FindByEmailAsync("missing@example.com"))
            .ReturnsAsync((ApplicationUser?)null);

        await using var context = CreateContext();
        var service = CreateService(context, userManager);

        var exception = await Assert.ThrowsAsync<UnauthorizedException>(() =>
            service.LoginAsync("missing@example.com", "password", false));

        Assert.Equal(ErrorCodes.InvalidCredentials, exception.ErrorCode);
    }

    [Fact]
    public async Task RegisterAsync_ThrowsConflict_WhenEmailAlreadyExists()
    {
        var userManager = CreateUserManager();
        userManager
            .Setup(manager => manager.FindByEmailAsync("used@example.com"))
            .ReturnsAsync(new ApplicationUser());

        await using var context = CreateContext();
        var service = CreateService(context, userManager);

        var exception = await Assert.ThrowsAsync<ConflictException>(() =>
            service.RegisterAsync(
                "user",
                "used@example.com",
                "0123456789",
                "password",
                "password"));

        Assert.Equal(ErrorCodes.EmailAlreadyRegistered, exception.ErrorCode);
    }

    [Fact]
    public async Task SendOtpAsync_ThrowsNotFound_WhenEmailDoesNotExist()
    {
        var userManager = CreateUserManager();
        userManager
            .Setup(manager => manager.FindByEmailAsync("missing@example.com"))
            .ReturnsAsync((ApplicationUser?)null);

        await using var context = CreateContext();
        var service = CreateService(context, userManager);

        var exception = await Assert.ThrowsAsync<NotFoundException>(() =>
            service.SendOtpAsync("missing@example.com"));

        Assert.Equal(ErrorCodes.EmailNotFound, exception.ErrorCode);
    }

    private static AuthService CreateService(
        AppDbContext context,
        Mock<UserManager<ApplicationUser>> userManager)
    {
        var roleStore = new Mock<IRoleStore<ApplicationRole>>();
        var roleManager = new RoleManager<ApplicationRole>(
            roleStore.Object,
            [],
            new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            NullLogger<RoleManager<ApplicationRole>>.Instance);

        var claimsFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        var schemes = new Mock<IAuthenticationSchemeProvider>();
        var confirmation = new Mock<IUserConfirmation<ApplicationUser>>();

        var signInManager = new SignInManager<ApplicationUser>(
            userManager.Object,
            new HttpContextAccessor(),
            claimsFactory.Object,
            Options.Create(new IdentityOptions()),
            NullLogger<SignInManager<ApplicationUser>>.Instance,
            schemes.Object,
            confirmation.Object);

        return new AuthService(
            context,
            userManager.Object,
            signInManager,
            roleManager,
            Mock.Of<IJwtTokenService>(),
            Mock.Of<IEmailService>());
    }

    private static Mock<UserManager<ApplicationUser>> CreateUserManager()
    {
        return new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(),
            Options.Create(new IdentityOptions()),
            Mock.Of<IPasswordHasher<ApplicationUser>>(),
            Array.Empty<IUserValidator<ApplicationUser>>(),
            Array.Empty<IPasswordValidator<ApplicationUser>>(),
            new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(),
            Mock.Of<IServiceProvider>(),
            NullLogger<UserManager<ApplicationUser>>.Instance);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().Options;
        return new AppDbContext(options);
    }
}
