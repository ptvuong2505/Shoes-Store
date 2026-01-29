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

        public int Rating { get; set; } // 1–5
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        public ApplicationUser User { get; set; }
        public Product Product { get; set; }
    }

}
