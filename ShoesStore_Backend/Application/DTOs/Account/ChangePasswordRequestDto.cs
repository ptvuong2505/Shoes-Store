namespace Application.DTOs.Account
{
    public record ChangePasswordRequestDto(string CurrentPassword, string NewPassword);
}
