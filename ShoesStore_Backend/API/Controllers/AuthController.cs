using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Common.Responses;
using Application.DTOs.Auth;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto loginRequestDto)
        {
            var loginResult = await _authService.LoginAsync(
                loginRequestDto.Email,
                loginRequestDto.Password,
                loginRequestDto.IsRemember);

            var expiresAt = loginRequestDto.IsRemember
                ? DateTimeOffset.UtcNow.AddDays(7)
                : DateTimeOffset.UtcNow.AddHours(2);

            Response.Cookies.Append(
                "refreshToken",
                loginResult.RefreshToken,
                BuildRefreshCookieOptions(expiresAt));

            var response = new LoginResponseDto(
                loginResult.AccessToken,
                loginResult.userDto);

            return Ok(ApiResponse<LoginResponseDto>.Ok(
                response,
                "Login successful."));
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto registerRequestDto)
        {
            var result = await _authService.RegisterAsync(
                registerRequestDto.UserName,
                registerRequestDto.Email,
                registerRequestDto.Phone,
                registerRequestDto.Password,
                registerRequestDto.ConfirmPassword);

            return StatusCode(
                StatusCodes.Status201Created,
                ApiResponse<RegisterResultDto>.Created(
                    result,
                    "Registration successful."));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshAsync()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var token) || string.IsNullOrEmpty(token))
            {
                throw new UnauthorizedException(
                    ErrorCodes.RefreshTokenMissing,
                    "Refresh token is missing.");
            }

            var refreshResult = await _authService.RefreshTokenAsync(token);

            Response.Cookies.Append(
                "refreshToken",
                refreshResult.RefreshToken,
                BuildRefreshCookieOptions(refreshResult.RefreshTokenExpiresAt));

            var response = new AccessTokenResponseDto(refreshResult.AccessToken);

            return Ok(ApiResponse<AccessTokenResponseDto>.Ok(
                response,
                "Token refreshed successfully."));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token) && !string.IsNullOrEmpty(token))
            {
                await _authService.LogoutAsync(token);
            }

            Response.Cookies.Delete("refreshToken");

            return Ok(ApiResponse<object?>.Ok(
                null,
                "Logout successful."));
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtpAsync([FromBody] SendOtpRequestDto sendOtpRequestDto)
        {
            await _authService.SendOtpAsync(sendOtpRequestDto.Email);

            return Ok(ApiResponse<object?>.Ok(
                null,
                "OTP sent successfully."));
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtpAsync([FromBody] VerifyOtpRequestDto verifyOtpRequestDto)
        {
            await _authService.VerifyOtpAsync(
                verifyOtpRequestDto.Email,
                verifyOtpRequestDto.Otp);

            return Ok(ApiResponse<object?>.Ok(
                null,
                "OTP verified successfully."));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordRequestDto request)
        {
            await _authService.ResetPasswordAsync(
                request.Email,
                request.NewPassword,
                request.ConfirmPassword);

            return Ok(ApiResponse<object?>.Ok(
                null,
                "Password reset successfully."));
        }

        private CookieOptions BuildRefreshCookieOptions(DateTimeOffset expiresAt)
        {
            var isSecure = _configuration.GetValue<bool?>("Auth:RefreshTokenCookie:Secure") ?? true;
            var sameSiteRaw = _configuration["Auth:RefreshTokenCookie:SameSite"];
            var sameSite = SameSiteMode.None;

            if (!string.IsNullOrWhiteSpace(sameSiteRaw)
                && Enum.TryParse<SameSiteMode>(sameSiteRaw, ignoreCase: true, out var parsedSameSite))
            {
                sameSite = parsedSameSite;
            }

            if (!isSecure && sameSite == SameSiteMode.None)
            {
                sameSite = SameSiteMode.Lax;
            }

            return new CookieOptions
            {
                HttpOnly = true,
                Secure = isSecure,
                SameSite = sameSite,
                Expires = expiresAt
            };
        }
    }
}
