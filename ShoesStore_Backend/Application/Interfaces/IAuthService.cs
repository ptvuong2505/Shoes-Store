using Application.DTOs.Auth;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResultDto> LoginAsync(string email, string password, bool isRemember);
        Task<RegisterResultDto> RegisterAsync(string userName, string email, string phone, string password, string confirmPassword);
        Task<SendOtpResultDto> SendOtpAsync(string email);
        Task VerifyOtpAsync(string email, string otp);
        Task ResetPasswordAsync(string email, string newPassword, string confirmPassword);
        Task<RefreshTokenResultDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(string refreshToken);
    }
}
