namespace Application.DTOs.Auth
{
    public record RefreshTokenResultDto(string AccessToken, string RefreshToken, DateTimeOffset RefreshTokenExpiresAt);
}
