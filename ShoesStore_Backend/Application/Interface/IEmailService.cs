using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IEmailService
    {
        public Task SendOtpResetPasswordAsync(string toEmail, string firstName, string otp);
    }
}
