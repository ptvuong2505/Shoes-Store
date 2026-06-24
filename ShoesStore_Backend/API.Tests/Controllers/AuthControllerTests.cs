using API.Controllers;
using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Common.Responses;
using Application.DTOs.Account;
using Application.DTOs.Auth;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace API.Tests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public async Task LoginAsync_ReturnsLoginResponseWithoutRefreshToken()
    {
        var service = new FakeAuthService
        {
            LoginResult = new LoginResultDto(
                "access-token",
                "refresh-token",
                new UserDto
                {
                    Id = Guid.NewGuid(),
                    Email = "user@example.com",
                    UserName = "user"
                })
        };

        var controller = CreateController(service);

        var result = await controller.LoginAsync(
            new LoginRequestDto("user@example.com", "password", false));

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ApiResponse<LoginResponseDto>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal("access-token", response.Data?.AccessToken);
        Assert.Same(service.LoginResult.userDto, response.Data?.User);
    }

    [Fact]
    public async Task RefreshAsync_ThrowsUnauthorizedException_WhenCookieIsMissing()
    {
        var controller = CreateController(new FakeAuthService());

        var exception = await Assert.ThrowsAsync<UnauthorizedException>(
            controller.RefreshAsync);

        Assert.Equal(ErrorCodes.RefreshTokenMissing, exception.ErrorCode);
    }

    [Fact]
    public async Task SendOtpAsync_ReturnsSuccessResponse()
    {
        var controller = CreateController(new FakeAuthService());

        var result = await controller.SendOtpAsync(
            new SendOtpRequestDto("user@example.com"));

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<ApiResponse<object?>>(okResult.Value);
        Assert.True(response.Success);
        Assert.Equal("OTP sent successfully.", response.Message);
    }

    private static AuthController CreateController(IAuthService service)
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Auth:RefreshTokenCookie:Secure"] = "false",
                ["Auth:RefreshTokenCookie:SameSite"] = "Lax"
            })
            .Build();

        return new AuthController(service, configuration)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    private sealed class FakeAuthService : IAuthService
    {
        public LoginResultDto LoginResult { get; set; } = new(
            "access-token",
            "refresh-token",
            new UserDto());

        public Task<LoginResultDto> LoginAsync(
            string email,
            string password,
            bool isRemember)
        {
            return Task.FromResult(LoginResult);
        }

        public Task<RegisterResultDto> RegisterAsync(
            string userName,
            string email,
            string phone,
            string password,
            string confirmPassword)
        {
            return Task.FromResult(
                new RegisterResultDto(Guid.NewGuid(), userName, email));
        }

        public Task<SendOtpResultDto> SendOtpAsync(string email)
        {
            return Task.FromResult(
                new SendOtpResultDto("123456", email, "user"));
        }

        public Task VerifyOtpAsync(string email, string otp)
        {
            return Task.CompletedTask;
        }

        public Task ResetPasswordAsync(
            string email,
            string newPassword,
            string confirmPassword)
        {
            return Task.CompletedTask;
        }

        public Task<RefreshTokenResultDto> RefreshTokenAsync(string refreshToken)
        {
            return Task.FromResult(
                new RefreshTokenResultDto(
                    "new-access-token",
                    "new-refresh-token",
                    DateTimeOffset.UtcNow.AddDays(7)));
        }

        public Task LogoutAsync(string refreshToken)
        {
            return Task.CompletedTask;
        }
    }
}
