namespace Application.DTOs.Account
{
    public record UpdateProfileDto(string UserName, string Phone, DateOnly? BirthDate);
}
