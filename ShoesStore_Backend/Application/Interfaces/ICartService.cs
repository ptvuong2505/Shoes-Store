using Application.DTOs.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICartService
    {
        Task AddToCartAsync(string userId, AddToCartRequest request);
        Task<List<CartItemDto>> GetAll(string userId);
    }
}
