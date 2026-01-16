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
        Task<LoginResultDto> LoginAsync(string email, string password);
        Task<RegisterResultDto> RegisterAsync(string email, string password, string confirmPassword);
    }
}
