namespace Application.DTOs.Account
{
    public record UpdateProfileDto(string FullName, string Phone, DateOnly? BirthDate);
}
