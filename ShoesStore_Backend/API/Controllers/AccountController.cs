using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.Common.Responses;
using Application.DTOs.Account;
using Application.DTOs.Address;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            var userDto = await _accountService.GetProfileAsync(userId);
            return Ok(ApiResponse<UserDto>.Ok(userDto, "Profile retrieved successfully."));
        }

        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new RequestValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["file"] = ["File is required."]
                    });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            using var fileStream = file.OpenReadStream();
            var avatarUrl = await _imageService.UploadAvatarAsync(fileStream);
            await _accountService.UpdateAvatarAsync(userId, avatarUrl);

            return Ok(ApiResponse<object>.Ok(new { avatarUrl }, "Avatar uploaded successfully."));
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            var result = await _accountService.UpdateProfileAsync(userId, dto);
            return Ok(ApiResponse<UserDto>.Ok(result, "Profile updated successfully."));
        }

        [Authorize]
        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            var addresses = await _accountService.GetAddressesAsync(userId);
            return Ok(ApiResponse<List<AddressDto>>.Ok(addresses, "Addresses retrieved successfully."));
        }

        [Authorize]
        [HttpPut("addresses/{id}/set-primary")]
        public async Task<IActionResult> SetPrimaryAddress(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            await _accountService.SetPrimaryAddressAsync(userId, id);
            return Ok(ApiResponse<object?>.Ok(null, "Primary address updated successfully."));
        }

        [Authorize]
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            await _accountService.DeleteAddressAsync(userId, id);
            return Ok(ApiResponse<object?>.Ok(null, "Address deleted successfully."));
        }

        [Authorize]
        [HttpPost("addresses")]
        public async Task<IActionResult> CreateAddress([FromBody] CreateAddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            await _accountService.CreateAddressAsync(userId, dto);
            return StatusCode(
                StatusCodes.Status201Created,
                ApiResponse<object?>.Created(null, "Address created successfully."));
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            await _accountService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);
            return Ok(ApiResponse<object?>.Ok(null, "Password changed successfully."));
        }

        [Authorize]
        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviews()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedException(ErrorCodes.Unauthorized, "User ID claim not found.");

            var reviews = await _accountService.GetReviewsAsync(userId);
            return Ok(ApiResponse<List<UserReviewDto>>.Ok(reviews, "Reviews retrieved successfully."));
        }
    }
}
