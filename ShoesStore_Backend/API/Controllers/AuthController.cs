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
            try
            {
                var loginResult = await _authService.LoginAsync(loginRequestDto.Email, loginRequestDto.Password, loginRequestDto.IsRemember);
                var expiresAt = loginRequestDto.IsRemember ? DateTimeOffset.UtcNow.AddDays(7) : DateTimeOffset.UtcNow.AddHours(2);
                Response.Cookies.Append("refreshToken", loginResult.RefreshToken, BuildRefreshCookieOptions(expiresAt));
                return Ok(new
                {
                    accessToken = loginResult.AccessToken,
                    user = loginResult.userDto
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto registerRequestDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerRequestDto.UserName, registerRequestDto.Email, registerRequestDto.Phone, registerRequestDto.Password, registerRequestDto.ConfirmPassword);
                return Ok(new
                {
                    userId = result.UserId,
                    userName = result.UserName,
                    email = result.Email
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshAsync()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var token) || string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Message = "Refresh token is missing." });
            }

            try
            {
                var refreshResult = await _authService.RefreshTokenAsync(token);
                Response.Cookies.Append("refreshToken", refreshResult.RefreshToken, BuildRefreshCookieOptions(refreshResult.RefreshTokenExpiresAt));
                return Ok(new
                {
                    accessToken = refreshResult.AccessToken,
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { ex.Message });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token) && !string.IsNullOrEmpty(token))
            {
                await _authService.LogoutAsync(token);
                Response.Cookies.Delete("refreshToken");
            }
            Console.WriteLine("User logged out successfully.");
            return NoContent();
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtpAsync([FromBody] SendOtpRequestDto sendOtpRequestDto)
        {
            try
            {
                await _authService.SendOtpAsync(sendOtpRequestDto.Email);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtpAsync([FromBody] VerifyOtpRequestDto verifyOtpRequestDto)
        {
            try
            {
                await _authService.VerifyOtpAsync(verifyOtpRequestDto.Email, verifyOtpRequestDto.Otp);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordRequestDto request)
        {
            try
            {
                await _authService.ResetPasswordAsync(request.Email, request.NewPassword, request.ConfirmPassword);
                return Ok(new { Message = "Password reset successfully." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
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
