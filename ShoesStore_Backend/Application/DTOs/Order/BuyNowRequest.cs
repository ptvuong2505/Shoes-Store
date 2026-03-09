using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Order
{
    public class BuyNowRequest
    {
        public string ProductId { get; set; }
        public int Size { get; set; }
        public int Quantity { get; set; }
    }
}
