namespace Domain.Entities
{
    public class PasswordResetOtp
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string OtpHash { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
    }
}
