using Application.DTOs.Chat;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ChatService : IChatService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ChatConversationDto> GetCustomerConversationAsync(string customerId)
        {
            var customerGuid = ParseUserId(customerId);
            var admin = await GetSupportAdminAsync();

            var messages = await GetMessagesBetweenUsersAsync(customerGuid, admin.Id);
            var users = await GetUsersMapAsync(messages);

            return new ChatConversationDto
            {
                CustomerId = customerGuid,
                CustomerName = await GetUserDisplayNameAsync(customerGuid),
                CustomerEmail = users.TryGetValue(customerGuid, out var customer) ? customer.Email : null,
                CustomerAvatarUrl = users.TryGetValue(customerGuid, out var customerWithAvatar) ? customerWithAvatar.AvatarUrl : null,
                UnreadCount = messages.Count(message => message.ToUserId == customerGuid && !message.IsRead),
                LastMessageAt = messages.LastOrDefault()?.SentAt,
                LastMessage = messages.LastOrDefault() is { } lastMessage
                    ? await MapMessageAsync(lastMessage, users)
                    : null,
                Messages = await MapMessagesAsync(messages, users)
            };
        }

        public async Task<List<ChatConversationDto>> GetAdminConversationsAsync(string adminId)
        {
            var adminGuid = ParseUserId(adminId);
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var adminIds = admins.Select(admin => admin.Id).ToHashSet();

            if (adminIds.Count == 0)
            {
                adminIds.Add(adminGuid);
            }

            var allMessages = await _context.ChatMessages
                .Where(message => adminIds.Contains(message.FromUserId) || adminIds.Contains(message.ToUserId))
                .OrderBy(message => message.SentAt)
                .ToListAsync();

            var customerIds = allMessages
                .Select(message => adminIds.Contains(message.FromUserId) ? message.ToUserId : message.FromUserId)
                .Where(userId => !adminIds.Contains(userId))
                .Distinct()
                .ToList();

            var users = await GetUsersMapAsync(allMessages);
            var conversations = new List<ChatConversationDto>();

            foreach (var customerId in customerIds)
            {
                var conversationMessages = allMessages
                    .Where(message =>
                        (message.FromUserId == customerId && adminIds.Contains(message.ToUserId)) ||
                        (message.ToUserId == customerId && adminIds.Contains(message.FromUserId)))
                    .OrderBy(message => message.SentAt)
                    .ToList();

                users.TryGetValue(customerId, out var customer);

                conversations.Add(new ChatConversationDto
                {
                    CustomerId = customerId,
                    CustomerName = GetDisplayName(customer),
                    CustomerEmail = customer?.Email,
                    CustomerAvatarUrl = customer?.AvatarUrl,
                    UnreadCount = conversationMessages.Count(message => message.ToUserId == adminGuid && !message.IsRead),
                    LastMessageAt = conversationMessages.LastOrDefault()?.SentAt,
                    LastMessage = conversationMessages.LastOrDefault() is { } lastMessage
                        ? await MapMessageAsync(lastMessage, users)
                        : null,
                    Messages = await MapMessagesAsync(conversationMessages, users)
                });
            }

            return conversations
                .OrderByDescending(conversation => conversation.LastMessageAt)
                .ToList();
        }

        public async Task<ChatMessageDto> SendCustomerMessageAsync(string customerId, string message)
        {
            var customerGuid = ParseUserId(customerId);
            var admin = await GetSupportAdminAsync();

            return await CreateMessageAsync(customerGuid, admin.Id, message);
        }

        public async Task<ChatMessageDto> SendAdminMessageAsync(string adminId, Guid customerId, string message)
        {
            var adminGuid = ParseUserId(adminId);
            var customerExists = await _context.Users.AnyAsync(user => user.Id == customerId);

            if (!customerExists)
            {
                throw new InvalidOperationException("Customer not found.");
            }

            return await CreateMessageAsync(adminGuid, customerId, message);
        }

        public async Task MarkConversationAsReadAsync(string currentUserId, Guid otherUserId)
        {
            var currentGuid = ParseUserId(currentUserId);
            var unreadMessages = await _context.ChatMessages
                .Where(message =>
                    message.FromUserId == otherUserId &&
                    message.ToUserId == currentGuid &&
                    !message.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

        private async Task<ChatMessageDto> CreateMessageAsync(Guid fromUserId, Guid toUserId, string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                throw new InvalidOperationException("Message is required.");
            }

            var chatMessage = new ChatMessage
            {
                Id = Guid.NewGuid(),
                FromUserId = fromUserId,
                ToUserId = toUserId,
                Message = message.Trim(),
                IsRead = false,
                SentAt = DateTime.UtcNow
            };

            await _context.ChatMessages.AddAsync(chatMessage);
            await _context.SaveChangesAsync();

            var users = await GetUsersMapAsync([chatMessage]);
            return await MapMessageAsync(chatMessage, users);
        }

        private async Task<ApplicationUser> GetSupportAdminAsync()
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            var admin = admins.FirstOrDefault();

            if (admin == null)
            {
                throw new InvalidOperationException("Support admin account not found.");
            }

            return admin;
        }

        private async Task<List<ChatMessage>> GetMessagesBetweenUsersAsync(Guid firstUserId, Guid secondUserId)
        {
            return await _context.ChatMessages
                .Where(message =>
                    (message.FromUserId == firstUserId && message.ToUserId == secondUserId) ||
                    (message.FromUserId == secondUserId && message.ToUserId == firstUserId))
                .OrderBy(message => message.SentAt)
                .ToListAsync();
        }

        private async Task<Dictionary<Guid, ApplicationUser>> GetUsersMapAsync(IEnumerable<ChatMessage> messages)
        {
            var userIds = messages
                .SelectMany(message => new[] { message.FromUserId, message.ToUserId })
                .Distinct()
                .ToList();

            return await _context.Users
                .Where(user => userIds.Contains(user.Id))
                .ToDictionaryAsync(user => user.Id);
        }

        private async Task<List<ChatMessageDto>> MapMessagesAsync(
            IEnumerable<ChatMessage> messages,
            IReadOnlyDictionary<Guid, ApplicationUser> users)
        {
            var result = new List<ChatMessageDto>();

            foreach (var message in messages)
            {
                result.Add(await MapMessageAsync(message, users));
            }

            return result;
        }

        private async Task<ChatMessageDto> MapMessageAsync(
            ChatMessage message,
            IReadOnlyDictionary<Guid, ApplicationUser> users)
        {
            users.TryGetValue(message.FromUserId, out var sender);
            var senderRoles = sender == null
                ? []
                : await _userManager.GetRolesAsync(sender);

            return new ChatMessageDto
            {
                Id = message.Id,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,
                Message = message.Message,
                IsRead = message.IsRead,
                SentAt = message.SentAt,
                SenderName = GetDisplayName(sender),
                SenderRole = senderRoles.Contains("Admin") ? "Admin" : "Customer"
            };
        }

        private async Task<string> GetUserDisplayNameAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(currentUser => currentUser.Id == userId);
            return GetDisplayName(user);
        }

        private static string GetDisplayName(ApplicationUser? user)
        {
            return user?.UserName ?? user?.Email ?? "Unknown user";
        }

        private static Guid ParseUserId(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedUserId))
            {
                throw new InvalidOperationException("Invalid user id.");
            }

            return parsedUserId;
        }
    }
}
