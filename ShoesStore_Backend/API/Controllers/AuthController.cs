using Application.DTOs.Auth;
using Application.Features.Auth;
using Application.Interface;
using Domain.Entities;
using Domain.Identity;
using Infrastructure.Persistence;
using Infrastructure.Service;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IMediator _mediator;
        private AppDbContext _context;
        private UserManager<ApplicationUser> _userManager;
        private IJwtTokenService _jwtTokenService;

        public AuthController(IMediator mediator, AppDbContext context, UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService)
        {
            _mediator = mediator;
            _context = context;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto loginRequestDto)
        {
            try
            {
                var result = await _mediator.Send(new LoginCommand(loginRequestDto.Email, loginRequestDto.Password, loginRequestDto.IsRemember));
                Console.WriteLine($"Login successful. {result.RefreshToken}");
                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = loginRequestDto.IsRemember ? DateTimeOffset.UtcNow.AddDays(7) : DateTimeOffset.UtcNow.AddHours(2)
                });
                return Ok(new
                {
                    accessToken = result.AccessToken,
                    user = result.userDto
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto registerRequestDto)
        {
            try
            {
                var result = await _mediator.Send(new RegisterCommand(registerRequestDto.UserName, registerRequestDto.Email, registerRequestDto.Phone, registerRequestDto.Password, registerRequestDto.ConfirmPassword));
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

            var oldRefreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token);
            if (oldRefreshToken == null || oldRefreshToken.IsRevoked || oldRefreshToken.ExpiresAt <= DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Invalid or expired refresh token." });
            }
            oldRefreshToken.IsRevoked = true;

            var user = await _userManager.FindByIdAsync(oldRefreshToken.UserId.ToString());
            if (user == null)
            {
                return Unauthorized(new { Message = "User not found." });
            }
            var roles = await _userManager.GetRolesAsync(user);

            var newRefreshToken = _jwtTokenService.CreateRefreshToken();

            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken!,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
            };

            var accessToken = _jwtTokenService.CreateAccessToken(user, roles);

            await _context.RefreshTokens.AddAsync(newRefreshTokenEntity);
            await _context.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", newRefreshToken!, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            return Ok(new
            {
                accessToken = accessToken,
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token) && !string.IsNullOrEmpty(token))
            {
                await _jwtTokenService.RevokeRefreshTokenAsync(token);
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
                await _mediator.Send(new SendOtpCommand(sendOtpRequestDto.Email));
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
                await _mediator.Send(new VerifyOtpCommand(verifyOtpRequestDto.Email, verifyOtpRequestDto.Otp));
                return Ok();
            } catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        //[HttpPost("reset-password")]
        //public async Task<IActionResult> ResetPasswordAsync([FromBody] )
        //{
        //    try
        //    {

        //    } catch (InvalidOperationException ex)
        //    {
        //        return BadRequest(new { Message = ex.Message });
        //    }
        //}
    }
}
