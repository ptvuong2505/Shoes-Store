using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Order
{
    public class OrderDetailDto
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
