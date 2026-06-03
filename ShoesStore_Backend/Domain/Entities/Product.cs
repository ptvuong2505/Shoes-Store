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

        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string Description { get; set; } = string.Empty;

        public Guid BrandId { get; set; }
        public Brand Brand { get; set; } = null!;

        public ICollection<ProductImage> Images { get; set; } = [];
        public ICollection<ProductInventory> Inventories { get; set; } = [];
        public ICollection<Review> Reviews { get; set; } = [];
    }

}
