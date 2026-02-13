using Application.DTOs.Order;
using Application.DTOs.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IOrderService
    {
        Task<PagedResult<OrderDto>> GetUserOrdersAsync(string userId, int page, int pageSize);
        Task<OrderDetailDto?> GetOrderDetailAsync(string userId, string orderId);
    }
}
