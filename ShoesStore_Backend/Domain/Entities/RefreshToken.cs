namespace Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public bool RememberMe { get; set; } = false;
        public Guid UserId { get; set; }
    }
}
