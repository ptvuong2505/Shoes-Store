using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Product
{
    public class ProductDetailDto : ProductDto
    {
        public List<string> ImageUrls { get; set; } = [];
        public List<ProductSizeDto> Sizes { get; set; } = [];
        public List<int> Ratings { get; set; } = new List<int> { 0, 0, 0, 0, 0 };
        public List<ReviewDto> Reviews { get; set; } = [];
    }

    public class ProductSizeDto
    {
        public int Size { get; set; }
        public int Stock { get; set; }
    }

    public class ReviewDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

