using Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IAuthService
    {
        Task<LoginResultDto> LoginAsync(string email, string password, bool isRemember);
        Task<RegisterResultDto> RegisterAsync(string userName, string email, string phone, string password, string confirmPassword);
        Task<SendOtpResultDto> SendOtpAsync(string email);
        Task VerifyOtpAsync(string email, string otp);
    }
}
