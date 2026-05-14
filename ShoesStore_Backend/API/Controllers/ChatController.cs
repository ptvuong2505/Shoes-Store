using Application.DTOs.Chat;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("my-conversation")]
        public async Task<IActionResult> GetMyConversation()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            try
            {
                var conversation = await _chatService.GetCustomerConversationAsync(userId);
                return Ok(conversation);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/conversations")]
        public async Task<IActionResult> GetAdminConversations()
        {
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (adminId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            var conversations = await _chatService.GetAdminConversationsAsync(adminId);
            return Ok(conversations);
        }

        [HttpPost("customer/send")]
        public async Task<IActionResult> SendCustomerMessage([FromBody] SendCustomerChatMessageRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            try
            {
                var message = await _chatService.SendCustomerMessageAsync(userId, request.Message);
                return Ok(message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin/send")]
        public async Task<IActionResult> SendAdminMessage([FromBody] SendAdminChatMessageRequest request)
        {
            var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (adminId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            try
            {
                var message = await _chatService.SendAdminMessageAsync(adminId, request.ToUserId, request.Message);
                return Ok(message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPatch("read/{otherUserId:guid}")]
        public async Task<IActionResult> MarkConversationAsRead(Guid otherUserId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            await _chatService.MarkConversationAsReadAsync(userId, otherUserId);
            return NoContent();
        }
    }
}
