using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ProductInventory
    {
        public Guid ProductId { get; set; }
        public Guid SizeId { get; set; }

        public int Quantity { get; set; }

        public Product Product { get; set; }
        public Size Size { get; set; }
    }

}
