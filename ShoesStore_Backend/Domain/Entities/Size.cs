using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Size
    {
        public Guid Id { get; set; }
        public int Value { get; set; } // 38, 39, 40…

        public ICollection<ProductInventory> Inventories { get; set; }
    }

}
