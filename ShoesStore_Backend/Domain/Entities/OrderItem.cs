using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public Guid SizeId { get; set; }

        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public Order Order { get; set; } = null!;
        public Product Product { get; set; } = null!;
        public Size Size { get; set; } = null!;
    }

}
