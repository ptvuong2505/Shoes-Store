using Application.DTOs.Auth;
using Application.Features.Auth;
using Application.Interface;
using Domain.Entities;
using Domain.Identity;
using Infrastructure.Persistence;
using Infrastructure.Service;
using MediatR;
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

        public AuthController(IMediator mediator, AppDbContext context, UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService )
        {
            _mediator = mediator;
            _context = context;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto loginRequestDto)
        {
            Console.WriteLine("Login attempt for email: " + loginRequestDto.Email + " "+loginRequestDto.Password );
            try
            {
                var result = await _mediator.Send(new LoginCommand(loginRequestDto.Email, loginRequestDto.Password));
                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new
                {
                    accessToken = result.AccessToken,
                    user = result.userDto
                });
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequestDto registerRequestDto)
        {
            try
            {
                var result = await _mediator.Send(new RegisterCommand(registerRequestDto.Email, registerRequestDto.Password, registerRequestDto.ConfirmPassword));
                return Ok(new
                {
                    userId = result.UserId,
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
            if(!Request.Cookies.TryGetValue("refreshToken", out var token) || string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Message = "Refresh token is missing." });
            }
            
            var oldRefreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(x=>x.Token == token);
            if(oldRefreshToken == null || oldRefreshToken.IsRevoked || oldRefreshToken.ExpiresAt <= DateTime.UtcNow)
            {
                return Unauthorized(new { Message = "Invalid or expired refresh token." });
            }
            oldRefreshToken.IsRevoked = true;

            var user = await _userManager.FindByIdAsync(oldRefreshToken.UserId.ToString());
            if(user == null) 
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
    }
}
