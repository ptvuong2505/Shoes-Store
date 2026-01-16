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
    public record RegisterCommand(string Email, string Password, string ComfirmPassword) : IRequest<RegisterResultDto>;
    public class RegisterHandler : IRequestHandler<RegisterCommand, RegisterResultDto>
    {
        private readonly IAuthService _authService;
        public RegisterHandler(IAuthService authService)
        {
            _authService = authService;
        }
        public async Task<RegisterResultDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            return await _authService.RegisterAsync(request.Email, request.Password, request.ComfirmPassword);
        }
    }
}
