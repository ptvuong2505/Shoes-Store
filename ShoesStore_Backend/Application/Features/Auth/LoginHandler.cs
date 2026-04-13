using Application.DTOs.Auth;
using Application.Interface;
using Domain.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Auth
{
    public record LoginCommand(string Email, string Password, bool IsRemember) : IRequest<LoginResultDto>;

    public class LoginHandler : IRequestHandler<LoginCommand, LoginResultDto>
    {
        private readonly IAuthService _authService;

        public LoginHandler(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            return await _authService.LoginAsync(request.Email, request.Password, request.IsRemember);
        }
    }
}
