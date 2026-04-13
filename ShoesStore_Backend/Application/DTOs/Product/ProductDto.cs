using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Product
{
    public class ProductDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Gender { get; set; } // Nam / Nữ / Unisex
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public string Description { get; set; }
        public string Brand { get; set; }
        public double AverageRating { get; set; }
        public int totalRatings { get; set; }
        public string MainImageUrl { get; set; }
    }
}
