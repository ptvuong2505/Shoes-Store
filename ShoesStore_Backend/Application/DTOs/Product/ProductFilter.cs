using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Product
{
    public class ProductFilter
    {
        public string? Search { get; set; }

        public List<string>? Genders { get; set; }     // Men, Women, Unisex
        public List<string>? Brands { get; set; }

        public List<int>? Sizes { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 6;
    }
}
