using Application.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Auth
{
    public record VerifyOtpCommand(string Email, string Otp) : IRequest<Unit>;
    public class VerifyOtpHandler : IRequestHandler<VerifyOtpCommand, Unit>
    {
        private readonly IAuthService _authService;

        public VerifyOtpHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<Unit> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
        {
            await _authService.VerifyOtpAsync(request.Email, request.Otp);
            return Unit.Value;
        }
    }
}
