using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Payment
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }

        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime PaidAt { get; set; }

        public Order Order { get; set; } = null!;
    }

}
