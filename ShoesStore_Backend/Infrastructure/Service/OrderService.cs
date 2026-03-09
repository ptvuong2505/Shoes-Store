using Application.DTOs.Order;
using Application.DTOs.Paging;
using Application.Interface;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> BuyNowAsync(string userId, BuyNowRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id.ToString() == userId);
            if (user == null)
                throw new Exception("User not found");

            var product = _context.Products.FirstOrDefault(p => p.Id.ToString() == request.ProductId);
            if (product == null)
                throw new Exception("Product not found");

            var productInventory = product.Inventories.FirstOrDefault(i => i.Size.Value == request.Size);
            if (productInventory == null)
                throw new Exception("Product size not found");

            var size = _context.Sizes.FirstOrDefault(s => s.Value == request.Size);
            if (size == null)
                throw new Exception("Size not found");

            if (productInventory.Quantity < request.Quantity)
                throw new Exception("Not enough inventory");

            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                AddressId = user.Addresses.Where(a => a.IsPrimary).FirstOrDefault()?.Id ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = product.Price * request.Quantity,
                Items = new List<OrderItem>
                {
                    new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        Quantity = request.Quantity,
                        Size = size
                    }
                }
            };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order.Id.ToString();
        }

        public async Task<OrderDetailDto?> GetOrderDetailAsync(string userId, string orderId)
        {
            return await _context.Orders.Where(o => o.Id.ToString().Equals(orderId)).Select(o => new OrderDetailDto
            {
                Id = o.Id,
                OrderDate = o.CreatedAt,
                ShippingAddress = o.Address.AddressLine,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Size = i.Size.Value.ToString(),
                    Gender = i.Product.Gender
                }).ToList()
            }).FirstOrDefaultAsync();
        }

        public async Task<PagedResult<OrderDto>> GetUserOrdersAsync(string userId, int page, int pageSize)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            var query = _context.Orders
                .Where(o => o.UserId.ToString() == userId)
                .OrderByDescending(o => o.CreatedAt);

            var totalItems = await query.CountAsync();

            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderDate = o.CreatedAt,
                    Status = o.Status,
                    TotalAmount = o.TotalAmount
                })
                .ToListAsync();

            return new PagedResult<OrderDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                Items = orders
            };

        }
    }
}
