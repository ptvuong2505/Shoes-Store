using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Product
{
    public class FiltersDto
    {
        public List<string> Genders { get; set; }
        public List<string> Brands { get; set; }
        public List<int> Sizes { get; set; }
    }
}
