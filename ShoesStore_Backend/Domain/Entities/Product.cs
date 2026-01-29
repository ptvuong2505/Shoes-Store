using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Product
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Gender { get; set; } // Nam / Nữ / Unisex
        public decimal Price { get; set; }
        public string Description { get; set; }

        public Guid BrandId { get; set; }
        public Brand Brand { get; set; }

        public ICollection<ProductInventory> Inventories { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }

}
