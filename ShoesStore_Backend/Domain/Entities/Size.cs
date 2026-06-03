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
        public int Value { get; set; }

        public ICollection<ProductInventory> Inventories { get; set; } = [];
    }

}
