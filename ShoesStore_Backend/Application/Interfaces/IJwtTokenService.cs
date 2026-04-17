namespace Application.Interfaces
{
    public interface IJwtTokenService
    {
        string? CreateAccessToken(Guid userId, string email, IList<string> roles);
        string? CreateRefreshToken();
        Task RevokeRefreshTokenAsync(string refreshToken);
    }
}
