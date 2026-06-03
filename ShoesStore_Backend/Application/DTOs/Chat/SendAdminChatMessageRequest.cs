namespace Application.DTOs.Chat
{
    public class SendAdminChatMessageRequest
    {
        public Guid ToUserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
