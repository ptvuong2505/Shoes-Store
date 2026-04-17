using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public ApplicationUser User { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }

}
