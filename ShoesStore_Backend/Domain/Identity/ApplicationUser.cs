using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace Domain.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public ICollection<Address> Addresses { get; set; }
        public ICollection<Order> Orders { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
