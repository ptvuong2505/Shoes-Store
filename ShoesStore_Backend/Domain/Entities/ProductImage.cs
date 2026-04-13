using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ProductImage
    {
        public Guid Id { get; set; }

        public string ImageUrl { get; set; }

        public bool IsMain { get; set; } = false ; // ảnh chính

        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}
