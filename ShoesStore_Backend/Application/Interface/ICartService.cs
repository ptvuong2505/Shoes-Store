using Application.DTOs.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface ICartService
    {
        public Task<List<CartItemDto>> GetAll(string userId);
    }
}
