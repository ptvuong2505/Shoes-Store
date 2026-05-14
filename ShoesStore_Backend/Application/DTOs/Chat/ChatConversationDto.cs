namespace Application.DTOs.Chat
{
    public class ChatConversationDto
    {
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        public string? CustomerAvatarUrl { get; set; }
        public int UnreadCount { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public ChatMessageDto? LastMessage { get; set; }
        public List<ChatMessageDto> Messages { get; set; } = [];
    }
}
