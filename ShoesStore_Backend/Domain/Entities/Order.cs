using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public Guid AddressId { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public ApplicationUser User { get; set; } = null!;
        public Address Address { get; set; } = null!;
        public ICollection<OrderItem> Items { get; set; } = [];
        public Payment? Payment { get; set; }
    }

}
