using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CartItem
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public Guid ProductId { get; set; }
        public Guid SizeId { get; set; }
        public int Quantity { get; set; }

        public ApplicationUser User { get; set; } = null!;
        public Product Product { get; set; } = null!;
        public Size Size { get; set; } = null!;
    }

}
