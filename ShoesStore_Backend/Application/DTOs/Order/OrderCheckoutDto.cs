using Application.DTOs.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Order
{
    public class OrderCheckoutDto
    {
        public Guid OrderId { get; set; }

        public string Status { get; set; }

        public decimal TotalAmount { get; set; }

        public AddressDto? Address { get; set; }

        public List<OrderItemCheckoutDto> Items { get; set; }
    }
}
