using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string? FullName { get; set; }
        public string? AvatarUrl { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
