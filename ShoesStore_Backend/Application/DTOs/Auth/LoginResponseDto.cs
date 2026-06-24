using Application.DTOs.Account;

namespace Application.DTOs.Auth;

public sealed record LoginResponseDto(
    string AccessToken,
    UserDto User);
