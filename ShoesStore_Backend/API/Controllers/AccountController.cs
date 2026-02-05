using Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    }
}
