using Application.DTOs.Account;
using Application.DTOs.Address;
using Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        private readonly IImageService _imageService;
        public AccountController(IAccountService accountService, IImageService imageService)
        {
            _accountService = accountService;
            _imageService = imageService;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }
            try
            {
                var userDto = await _accountService.GetProfile(userIdClaim);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });

            }
        }

        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }
            try
            {
                Stream fileStream = file.OpenReadStream();
                var avatarUrl = await _imageService.UploadAvatarAsync(fileStream);
                
                await _accountService.UpdateUserAvatar(userId, avatarUrl);

                return Ok(new { avatarUrl });

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during avatar upload: {ex.Message}");
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }
            try
            {
                var result = await _accountService.UpdateProfile(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddress()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }
            try
            {
                var addresses = await _accountService.GetAddress(userId);
                return Ok(addresses);
            }
            catch (Exception ex) {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("addresses/{id}/set-primary")]
        public async Task<IActionResult> SetPrimaryAddress(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _accountService.SetPrimaryAddress(userId, id);

            return NoContent();
        }

        [Authorize]
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _accountService.DeleteAddress(userId, id);

            return NoContent();
        }

        [Authorize]
        [HttpPost("addresses")]
        public async Task<IActionResult> CreateAddress([FromBody] CreateAddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            await _accountService.CreateAddress(userId, dto);

            return Ok(new { Message = "Address created successfully" });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            try
            {
                var result = await _accountService.ChangePassword(userId, request.CurrentPassword, request.NewPassword);
                if (result)
                {
                    return Ok("Change password successfully");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

            return BadRequest("Error change password");
        }

    }
}
