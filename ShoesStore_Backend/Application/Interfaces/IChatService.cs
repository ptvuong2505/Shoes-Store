using Application.DTOs.Chat;

namespace Application.Interfaces
{
    public interface IChatService
    {
        Task<ChatConversationDto> GetCustomerConversationAsync(string customerId);
        Task<List<ChatConversationDto>> GetAdminConversationsAsync(string adminId);
        Task<ChatMessageDto> SendCustomerMessageAsync(string customerId, string message);
        Task<ChatMessageDto> SendAdminMessageAsync(string adminId, Guid customerId, string message);
        Task MarkConversationAsReadAsync(string currentUserId, Guid otherUserId);
    }
}
