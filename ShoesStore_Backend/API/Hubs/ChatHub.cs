using Application.DTOs.Chat;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, GetUserGroup(userId));
            }

            if (Context.User?.IsInRole("Admin") == true)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
            }

            await base.OnConnectedAsync();
        }

        public async Task SendCustomerMessage(SendCustomerChatMessageRequest request)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new HubException("Unauthorized.");
            }

            var message = await _chatService.SendCustomerMessageAsync(userId, request.Message);

            await Clients.Group("admins").SendAsync("ReceiveMessage", message);
            await Clients.Group(GetUserGroup(userId)).SendAsync("ReceiveMessage", message);
        }

        [Authorize(Roles = "Admin")]
        public async Task SendAdminMessage(SendAdminChatMessageRequest request)
        {
            var adminId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(adminId))
            {
                throw new HubException("Unauthorized.");
            }

            var message = await _chatService.SendAdminMessageAsync(adminId, request.ToUserId, request.Message);

            await Clients.Group(GetUserGroup(request.ToUserId.ToString())).SendAsync("ReceiveMessage", message);
            await Clients.Group("admins").SendAsync("ReceiveMessage", message);
        }

        public async Task MarkConversationAsRead(Guid otherUserId)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new HubException("Unauthorized.");
            }

            await _chatService.MarkConversationAsReadAsync(userId, otherUserId);
        }

        private static string GetUserGroup(string userId)
        {
            return $"user:{userId}";
        }
    }
}
