using Application.DTOs.Paging;
using Application.DTOs.Product;
using Application.Interface;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProductDto>> GetAllProductsAsync(ProductFilter productFilter)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrEmpty(productFilter.Search))
            {
                query = query.Where(p => p.Name.Contains(productFilter.Search));
            }

            if (productFilter.Genders != null && productFilter.Genders.Any())
            {
                query = query.Where(p => productFilter.Genders.Contains(p.Gender));
            }

            if (productFilter.Brands != null && productFilter.Brands.Any())
            {
                query = query.Where(p => productFilter.Brands.Contains(p.Brand.Name));
            }

            if (productFilter.Sizes != null && productFilter.Sizes.Any())
            {
                query = query.Where(p =>
                    p.Inventories.Any(i => productFilter.Sizes.Contains(i.Size.Value))
                );
            }

            var totalCount = await query.CountAsync();

            var items = await query.Skip((productFilter.Page - 1) * productFilter.PageSize)
                .Take(productFilter.PageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Brand = p.Brand.Name,
                    Price = p.Price,
                    DiscountPrice = p.DiscountPrice,
                    Gender = p.Gender,
                    MainImageUrl = p.Images.Where(pi=> pi.IsMain).First().ImageUrl ?? "",
                    AverageRating = p.Reviews.Select(r => (double?)r.Rating).Average() ?? 0.0,
                    totalRatings = p.Reviews.Count()
                })
                .ToListAsync();
            return new PagedResult<ProductDto>
            {
                Items = items,
                Page = productFilter.Page,
                PageSize = productFilter.PageSize,
                TotalItems = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)productFilter.PageSize)
            };
        }

        public async Task<FiltersDto> GetFiltersAsync()
        {
            var brands = await _context.Brands.Select(b => b.Name).ToListAsync();
            var genders = await _context.Products.GroupBy(p => p.Gender).Select(g => g.Key).ToListAsync();
            var sizes = await _context.Sizes.Select(s => s.Value).ToListAsync();
            return new FiltersDto
            {
                Brands = brands,
                Genders = genders,
                Sizes = sizes
            };
        }

        public async Task<ProductDetailDto> GetProductDetailAsync(string id)
        {
            var guid = Guid.Parse(id);

            var productDetail = await _context.Products.Where(p => p.Id == guid)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    Brand = p.Brand.Name,
                    p.Price,
                    p.DiscountPrice,
                    AverageRating = p.Reviews.Select(r => (double?)r.Rating).Average() ?? 0.0,
                    totalRatings = p.Reviews.Count(),
                    p.Gender,
                    MainImageUrl = p.Images.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).FirstOrDefault() ?? "",
                    ImageUrls = p.Images.Where(pi => !pi.IsMain).Select(pi => pi.ImageUrl).ToList(),
                    Sizes = p.Inventories.Select(i => new ProductSizeDto { Size = i.Size.Value, Stock = i.Quantity }).ToList(),
                    RatingGroups = p.Reviews.GroupBy(r => r.Rating).Select(g => new { Rating = g.Key, Count = g.Count() }).ToList(),
                    Reviews = p.Reviews.Select(r => new ReviewDto
                    {
                        Id = r.Id,
                        Name = r.User.UserName!,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (productDetail == null) return null;

            var ratingDict = productDetail.RatingGroups.ToDictionary(r => r.Rating, r => r.Count);

            return new ProductDetailDto
            {
                Id = productDetail.Id,
                Name = productDetail.Name,
                Description = productDetail.Description,
                Brand = productDetail.Brand,
                Price = productDetail.Price,
                DiscountPrice = productDetail.DiscountPrice,
                AverageRating = productDetail.AverageRating,
                totalRatings = productDetail.totalRatings,
                Gender = productDetail.Gender,
                MainImageUrl = productDetail.MainImageUrl,
                ImageUrls = productDetail.ImageUrls,
                Sizes = productDetail.Sizes,
                Ratings = Enumerable.Range(1, 5).Reverse().Select(star => ratingDict.GetValueOrDefault(star, 0)).ToList(),
                Reviews = productDetail.Reviews
            };
        }

        public async Task<List<ProductDto>> GetTrendingProductsAsync()
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

            var topProductIds = await _context.OrderItems
                .Where(oi => oi.Order.Status == "Delivered" &&
                             oi.Order.CreatedAt >= thirtyDaysAgo)
                .GroupBy(oi => oi.ProductId)
                .OrderByDescending(g => g.Sum(x => x.Quantity))
                .Take(4)
                .Select(g => g.Key)
                .ToListAsync();

            var products = await _context.Products
                .Where(p => topProductIds.Contains(p.Id))
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Brand = p.Brand.Name,
                    Gender = p.Gender,
                    Price = p.Price
                })
                .ToListAsync();

            return topProductIds.Select(id => products.First(p => p.Id == id)).ToList();
        }
    }
}
