using Application.DTOs.Address;
using Application.DTOs.Order;
using Application.DTOs.Paging;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
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
            var user = _context.Users.Include(u => u.Addresses).FirstOrDefault(u => u.Id.ToString() == userId);
            if (user == null)
                throw new Exception("User not found");

            var product = _context.Products.FirstOrDefault(p => p.Id.ToString() == request.ProductId);
            if (product == null)
                throw new Exception("Product not found");

            var productInventory = _context.ProductInventories.FirstOrDefault(pi => pi.ProductId == product.Id && pi.Size.Value == request.Size);
            if (productInventory == null)
                throw new Exception("Product size not found");

            if (productInventory.Quantity < request.Quantity)
                throw new Exception("Not enough inventory");

            var size = _context.Sizes.FirstOrDefault(s => s.Value == request.Size);
            if (size == null)
                throw new Exception("Size not found");

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
                        SizeId = size.Id,
                        Price = product.Price,

                    }
                }
            };
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order.Id.ToString();
        }

        public async Task<string> CheckoutCartAsync(string userId, List<BuyNowRequest> requests)
        {
            if (requests == null || requests.Count == 0)
                throw new Exception("Checkout items are required");

            var user = await _context.Users
                .Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null)
                throw new Exception("User not found");

            var normalizedRequests = new List<(Guid ProductId, int Size, int Quantity)>();
            foreach (var item in requests)
            {
                if (!Guid.TryParse(item.ProductId, out var productId))
                    throw new Exception($"Invalid productId: {item.ProductId}");

                if (item.Size <= 0)
                    throw new Exception("Size must be greater than 0");

                if (item.Quantity <= 0)
                    throw new Exception("Quantity must be greater than 0");

                normalizedRequests.Add((productId, item.Size, item.Quantity));
            }

            var mergedRequests = normalizedRequests
                .GroupBy(x => new { x.ProductId, x.Size })
                .Select(g => new
                {
                    g.Key.ProductId,
                    g.Key.Size,
                    Quantity = g.Sum(x => x.Quantity)
                })
                .ToList();

            var productIds = mergedRequests.Select(x => x.ProductId).Distinct().ToList();
            var sizeValues = mergedRequests.Select(x => x.Size).Distinct().ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var sizes = await _context.Sizes
                .Where(s => sizeValues.Contains(s.Value))
                .ToDictionaryAsync(s => s.Value);

            if (products.Count != productIds.Count)
                throw new Exception("Some products were not found");

            if (sizes.Count != sizeValues.Count)
                throw new Exception("Some sizes were not found");

            var sizeIds = sizes.Values.Select(s => s.Id).Distinct().ToList();
            var inventories = await _context.ProductInventories
                .Where(pi => productIds.Contains(pi.ProductId) && sizeIds.Contains(pi.SizeId))
                .ToListAsync();

            decimal totalAmount = 0m;
            var orderItems = new List<OrderItem>();

            foreach (var requestItem in mergedRequests)
            {
                var product = products[requestItem.ProductId];
                var size = sizes[requestItem.Size];

                var inventory = inventories.FirstOrDefault(pi =>
                    pi.ProductId == product.Id && pi.SizeId == size.Id);

                if (inventory == null)
                    throw new Exception($"Inventory not found for product {product.Name} and size {requestItem.Size}");

                if (inventory.Quantity < requestItem.Quantity)
                    throw new Exception($"Not enough inventory for product {product.Name} size {requestItem.Size}");

                var unitPrice = product.DiscountPrice ?? product.Price;
                totalAmount += unitPrice * requestItem.Quantity;

                orderItems.Add(new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    SizeId = size.Id,
                    Quantity = requestItem.Quantity,
                    Price = unitPrice,
                });
            }

            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                AddressId = user.Addresses.FirstOrDefault(a => a.IsPrimary)?.Id ?? Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = totalAmount,
                Items = orderItems,
            };

            await _context.Orders.AddAsync(order);

            var selectedPairs = mergedRequests
                .Select(x => new { x.ProductId, SizeId = sizes[x.Size].Id })
                .ToList();

            var cartCandidates = await _context.CartItems
                .Where(ci => ci.UserId == user.Id
                    && productIds.Contains(ci.ProductId)
                    && sizeIds.Contains(ci.SizeId))
                .ToListAsync();

            var cartItemsToRemove = cartCandidates
                .Where(ci => selectedPairs.Any(sp => sp.ProductId == ci.ProductId && sp.SizeId == ci.SizeId))
                .ToList();

            if (cartItemsToRemove.Count > 0)
            {
                _context.CartItems.RemoveRange(cartItemsToRemove);
            }

            await _context.SaveChangesAsync();
            return order.Id.ToString();
        }

        public async Task<OrderCheckoutDto?> GetOrderCheckoutInfoAsync(string userId, string orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Address)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Size)
                .Where(o => o.Id.ToString() == orderId && o.UserId.ToString() == userId)
                .FirstOrDefaultAsync();

            if (order == null)
                return null;

            return new OrderCheckoutDto
            {
                OrderId = order.Id,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                Address = order.Address != null ? new AddressDto
                {
                    Id = order.Address.Id,
                    UserId = order.Address.UserId,
                    ReceiverName = order.Address.ReceiverName,
                    Phone = order.Address.Phone,
                    City = order.Address.City,
                    IsPrimary = order.Address.IsPrimary,
                    AddressLine = order.Address.AddressLine
                } : null,
                Items = order.Items.Select(i => new OrderItemCheckoutDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    ImageUrl = i.Product.Images.FirstOrDefault(img => img.IsMain)?.ImageUrl
                              ?? i.Product.Images.FirstOrDefault()?.ImageUrl
                              ?? string.Empty,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    Size = i.Size.Value,
                    SubTotal = i.Price * i.Quantity
                }).ToList()
            };
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
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    Size = i.Size.Value.ToString(),
                    Gender = i.Product.Gender,
                    ImageUrl = i.Product.Images.Where(img => img.IsMain).Select(img => img.ImageUrl).FirstOrDefault()
                        ?? i.Product.Images.Select(img => img.ImageUrl).FirstOrDefault()
                        ?? string.Empty
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

        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
        {
            var now = DateTime.UtcNow;
            var currentPeriodStart = now.AddDays(-30);
            var previousPeriodStart = now.AddDays(-60);
            var invalidStatuses = new[] { "Pending", "Cancelled", "Canceled" };

            var validOrders = _context.Orders
                .Where(o => !invalidStatuses.Contains(o.Status));

            var currentSales = await validOrders
                .Where(o => o.CreatedAt >= currentPeriodStart)
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

            var previousSales = await validOrders
                .Where(o => o.CreatedAt >= previousPeriodStart && o.CreatedAt < currentPeriodStart)
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;

            var currentOrders = await _context.Orders
                .Where(o => o.CreatedAt >= currentPeriodStart)
                .CountAsync();

            var previousOrders = await _context.Orders
                .Where(o => o.CreatedAt >= previousPeriodStart && o.CreatedAt < currentPeriodStart)
                .CountAsync();

            var firstOrdersByUsers = await _context.Orders
                .GroupBy(o => o.UserId)
                .Select(g => new
                {
                    UserId = g.Key,
                    FirstOrderAt = g.Min(x => x.CreatedAt)
                })
                .ToListAsync();

            var currentNewCustomers = firstOrdersByUsers.Count(x => x.FirstOrderAt >= currentPeriodStart);
            var previousNewCustomers = firstOrdersByUsers.Count(x => x.FirstOrderAt >= previousPeriodStart && x.FirstOrderAt < currentPeriodStart);

            var currentActiveUsers = await _context.Orders
                .Where(o => o.CreatedAt >= currentPeriodStart)
                .Select(o => o.UserId)
                .Distinct()
                .CountAsync();

            var previousActiveUsers = await _context.Orders
                .Where(o => o.CreatedAt >= previousPeriodStart && o.CreatedAt < currentPeriodStart)
                .Select(o => o.UserId)
                .Distinct()
                .CountAsync();

            var monthlyRevenueRaw = await validOrders
                .Where(o => o.CreatedAt.Year == now.Year)
                .GroupBy(o => o.CreatedAt.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .ToListAsync();

            var monthlyRevenueMap = monthlyRevenueRaw.ToDictionary(x => x.Month, x => x.Revenue);
            var revenueByMonth = Enumerable.Range(1, 12)
                .Select(month => new DashboardRevenuePointDto
                {
                    Month = month,
                    Revenue = monthlyRevenueMap.TryGetValue(month, out var revenue) ? revenue : 0m
                })
                .ToList();

            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(6)
                .Join(
                    _context.Users,
                    order => order.UserId,
                    user => user.Id,
                    (order, user) => new DashboardRecentOrderDto
                    {
                        OrderId = order.Id.ToString(),
                        CustomerName = user.UserName ?? user.Email ?? "Unknown",
                        Status = order.Status,
                        TotalAmount = order.TotalAmount
                    })
                .ToListAsync();

            var topProductRaw = await _context.OrderItems
                .Where(oi => !invalidStatuses.Contains(oi.Order.Status))
                .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                .Select(g => new
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.Name,
                    UnitsSold = g.Sum(x => x.Quantity),
                    UnitPrice = g.OrderByDescending(x => x.Order.CreatedAt).Select(x => x.Price).FirstOrDefault()
                })
                .OrderByDescending(x => x.UnitsSold)
                .Take(4)
                .ToListAsync();

            var topProductIds = topProductRaw.Select(x => x.ProductId).ToList();

            var topProductImageMap = await _context.ProductImages
                .Where(pi => topProductIds.Contains(pi.ProductId))
                .GroupBy(pi => pi.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    ImageUrl = g.OrderByDescending(x => x.IsMain).Select(x => x.ImageUrl).FirstOrDefault()
                })
                .ToDictionaryAsync(x => x.ProductId, x => x.ImageUrl);

            var topProducts = topProductRaw
                .Select(p => new DashboardTopProductDto
                {
                    ProductId = p.ProductId.ToString(),
                    ProductName = p.ProductName,
                    UnitsSold = p.UnitsSold,
                    UnitPrice = p.UnitPrice,
                    ImageUrl = topProductImageMap.TryGetValue(p.ProductId, out var imageUrl) ? imageUrl : null
                })
                .ToList();

            return new AdminDashboardDto
            {
                Summary = new DashboardSummaryDto
                {
                    TotalSales = currentSales,
                    TotalSalesGrowthPercent = CalculateGrowthPercent(currentSales, previousSales),
                    TotalOrders = currentOrders,
                    TotalOrdersGrowthPercent = CalculateGrowthPercent(currentOrders, previousOrders),
                    NewCustomers = currentNewCustomers,
                    NewCustomersGrowthPercent = CalculateGrowthPercent(currentNewCustomers, previousNewCustomers),
                    ActiveUsers = currentActiveUsers,
                    ActiveUsersGrowthPercent = CalculateGrowthPercent(currentActiveUsers, previousActiveUsers)
                },
                RevenueByMonth = revenueByMonth,
                RecentOrders = recentOrders,
                TopProducts = topProducts
            };
        }

        public async Task PaymentAsync(string userId, string orderId, string selectedAddressId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id.ToString() == orderId && o.UserId.ToString() == userId);
            if (order == null)
                throw new Exception("Order not found");

            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id.ToString() == selectedAddressId && a.UserId.ToString() == userId);
            if (address == null)
                throw new Exception("Selected address not found");

            order.AddressId = address.Id;
            order.Status = "Paid";
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        private static double CalculateGrowthPercent(decimal current, decimal previous)
        {
            if (previous == 0m)
            {
                return current == 0m ? 0d : 100d;
            }

            return Math.Round((double)((current - previous) / previous * 100m), 1);
        }

        private static double CalculateGrowthPercent(int current, int previous)
        {
            if (previous == 0)
            {
                return current == 0 ? 0d : 100d;
            }

            return Math.Round(((current - previous) / (double)previous) * 100d, 1);
        }
    }
}
