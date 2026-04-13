using Application.DTOs.Auth;
using Application.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Auth
{
    public record SendOtpCommand(string Email) : IRequest<Unit>;

    public class SendOtpHandler : IRequestHandler<SendOtpCommand, Unit>
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        public SendOtpHandler(IAuthService authService , IEmailService emailService)
        {
            _authService = authService;
            _emailService = emailService;
        }
        public async Task<Unit> Handle(SendOtpCommand request, CancellationToken cancellationToken)
        {
            var sendOtpResult = await _authService.SendOtpAsync(request.Email);
            await _emailService.SendOtpResetPasswordAsync(sendOtpResult.Email, sendOtpResult.UserName, sendOtpResult.Otp);
            return Unit.Value;
        }
    }
}
