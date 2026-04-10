using Application.DTOs.Paging;
using Application.DTOs.Product;
using Application.Interface;
using Domain.Entities;
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
                    MainImageUrl = p.Images.Where(pi => pi.IsMain).First().ImageUrl ?? "",
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

        public async Task<AdminProductListDto> GetAdminProductsAsync(AdminProductFilter filter)
        {
            if (filter.Page <= 0) filter.Page = 1;
            if (filter.PageSize <= 0) filter.PageSize = 10;

            var baseQuery = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var normalizedSearch = filter.Search.Trim().ToLower();
                baseQuery = baseQuery.Where(p =>
                    p.Name.ToLower().Contains(normalizedSearch)
                    || p.Brand.Name.ToLower().Contains(normalizedSearch)
                );
            }

            var totalItems = await baseQuery.CountAsync();

            var rawItems = await baseQuery
                .OrderByDescending(p => p.Id)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(p => new
                {
                    Id = p.Id,
                    Name = p.Name,
                    Sku = $"SKU-{p.Id.ToString().Substring(0, 8).ToUpper()}",
                    Brand = p.Brand.Name,
                    Price = p.DiscountPrice ?? p.Price,
                    MainImageUrl = p.Images
                        .OrderByDescending(img => img.IsMain)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault(),
                    TotalStock = p.Inventories.Sum(i => i.Quantity)
                })
                .ToListAsync();

            var items = rawItems.Select(item => new AdminProductItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Sku = item.Sku,
                Brand = item.Brand,
                Price = item.Price,
                MainImageUrl = item.MainImageUrl,
                TotalStock = item.TotalStock,
                StockStatus = item.TotalStock <= 0
                    ? "Out of Stock"
                    : item.TotalStock <= 10
                        ? "Low Stock"
                        : "In Stock"
            }).ToList();

            var totalProducts = await _context.Products.CountAsync();
            var outOfStockProducts = await _context.Products
                .CountAsync(p => !p.Inventories.Any() || p.Inventories.Sum(i => i.Quantity) <= 0);

            var topSellingProduct = await _context.OrderItems
                .GroupBy(oi => new { oi.ProductId, oi.Product.Name })
                .Select(g => new
                {
                    ProductName = g.Key.Name,
                    UnitsSold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.UnitsSold)
                .FirstOrDefaultAsync();

            var avgMarginPercent = await _context.Products
                .Where(p => p.Price > 0)
                .Select(p => (double)((p.Price - (p.DiscountPrice ?? p.Price)) / p.Price * 100m))
                .AverageAsync();

            return new AdminProductListDto
            {
                Summary = new AdminProductSummaryDto
                {
                    TotalProducts = totalProducts,
                    OutOfStockProducts = outOfStockProducts,
                    TopSellingProductName = topSellingProduct?.ProductName ?? "N/A",
                    TopSellingUnits = topSellingProduct?.UnitsSold ?? 0,
                    AverageMarginPercent = Math.Round(avgMarginPercent, 1)
                },
                Data = new PagedResult<AdminProductItemDto>
                {
                    Items = items,
                    Page = filter.Page,
                    PageSize = filter.PageSize,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize)
                }
            };
        }

        public async Task<AdminProductItemDto> CreateAdminProductAsync(AdminUpsertProductRequest request)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(request.Description) ? "No description" : request.Description.Trim(),
                Gender = string.IsNullOrWhiteSpace(request.Gender) ? "Unisex" : request.Gender.Trim(),
                Price = request.Price,
                DiscountPrice = request.DiscountPrice,
                BrandId = await GetOrCreateBrandIdAsync(request.Brand)
            };

            await _context.Products.AddAsync(product);

            var sizeId = await GetOrCreateSizeIdAsync(request.Size <= 0 ? 42 : request.Size);
            await _context.ProductInventories.AddAsync(new ProductInventory
            {
                ProductId = product.Id,
                SizeId = sizeId,
                Quantity = Math.Max(0, request.TotalStock)
            });

            if (!string.IsNullOrWhiteSpace(request.MainImageUrl))
            {
                await _context.ProductImages.AddAsync(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    ImageUrl = request.MainImageUrl.Trim(),
                    IsMain = true
                });
            }

            await _context.SaveChangesAsync();
            return await BuildAdminProductItemByIdAsync(product.Id);
        }

        public async Task<AdminProductItemDto?> UpdateAdminProductAsync(string id, AdminUpsertProductRequest request)
        {
            if (!Guid.TryParse(id, out var productId))
            {
                return null;
            }

            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Inventories)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                return null;
            }

            product.Name = request.Name.Trim();
            product.Description = string.IsNullOrWhiteSpace(request.Description) ? product.Description : request.Description.Trim();
            product.Gender = string.IsNullOrWhiteSpace(request.Gender) ? product.Gender : request.Gender.Trim();
            product.Price = request.Price;
            product.DiscountPrice = request.DiscountPrice;
            product.BrandId = await GetOrCreateBrandIdAsync(request.Brand);

            var sizeId = await GetOrCreateSizeIdAsync(request.Size <= 0 ? 42 : request.Size);
            var inventory = product.Inventories.FirstOrDefault(i => i.SizeId == sizeId);
            if (inventory == null)
            {
                await _context.ProductInventories.AddAsync(new ProductInventory
                {
                    ProductId = product.Id,
                    SizeId = sizeId,
                    Quantity = Math.Max(0, request.TotalStock)
                });
            }
            else
            {
                inventory.Quantity = Math.Max(0, request.TotalStock);
            }

            if (!string.IsNullOrWhiteSpace(request.MainImageUrl))
            {
                var previousMainImage = product.Images.FirstOrDefault(i => i.IsMain);

                foreach (var image in product.Images)
                {
                    image.IsMain = false;
                }

                if (previousMainImage == null)
                {
                    await _context.ProductImages.AddAsync(new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        ImageUrl = request.MainImageUrl.Trim(),
                        IsMain = true
                    });
                }
                else
                {
                    previousMainImage.ImageUrl = request.MainImageUrl.Trim();
                    previousMainImage.IsMain = true;
                }
            }

            await _context.SaveChangesAsync();
            return await BuildAdminProductItemByIdAsync(product.Id);
        }

        public async Task<bool> DeleteAdminProductAsync(string id)
        {
            if (!Guid.TryParse(id, out var productId))
            {
                return false;
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null)
            {
                return false;
            }

            var cartItems = _context.CartItems.Where(ci => ci.ProductId == productId);
            var orderItems = _context.OrderItems.Where(oi => oi.ProductId == productId);
            var reviews = _context.Reviews.Where(r => r.ProductId == productId);
            var inventories = _context.ProductInventories.Where(i => i.ProductId == productId);
            var images = _context.ProductImages.Where(i => i.ProductId == productId);

            _context.CartItems.RemoveRange(cartItems);
            _context.OrderItems.RemoveRange(orderItems);
            _context.Reviews.RemoveRange(reviews);
            _context.ProductInventories.RemoveRange(inventories);
            _context.ProductImages.RemoveRange(images);
            _context.Products.Remove(product);

            await _context.SaveChangesAsync();
            return true;
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

        private async Task<Guid> GetOrCreateBrandIdAsync(string brandName)
        {
            var normalized = brandName.Trim();
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name.ToLower() == normalized.ToLower());
            if (brand != null)
            {
                return brand.Id;
            }

            var newBrand = new Brand
            {
                Id = Guid.NewGuid(),
                Name = normalized
            };

            await _context.Brands.AddAsync(newBrand);
            await _context.SaveChangesAsync();
            return newBrand.Id;
        }

        private async Task<Guid> GetOrCreateSizeIdAsync(int sizeValue)
        {
            var size = await _context.Sizes.FirstOrDefaultAsync(s => s.Value == sizeValue);
            if (size != null)
            {
                return size.Id;
            }

            var newSize = new Size
            {
                Id = Guid.NewGuid(),
                Value = sizeValue
            };

            await _context.Sizes.AddAsync(newSize);
            await _context.SaveChangesAsync();
            return newSize.Id;
        }

        private async Task<AdminProductItemDto> BuildAdminProductItemByIdAsync(Guid productId)
        {
            var item = await _context.Products
                .Where(p => p.Id == productId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    Brand = p.Brand.Name,
                    Price = p.DiscountPrice ?? p.Price,
                    MainImageUrl = p.Images
                        .OrderByDescending(img => img.IsMain)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault(),
                    TotalStock = p.Inventories.Sum(i => i.Quantity)
                })
                .FirstAsync();

            return new AdminProductItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Sku = $"SKU-{item.Id.ToString().Substring(0, 8).ToUpper()}",
                Brand = item.Brand,
                Price = item.Price,
                MainImageUrl = item.MainImageUrl,
                TotalStock = item.TotalStock,
                StockStatus = item.TotalStock <= 0
                    ? "Out of Stock"
                    : item.TotalStock <= 10
                        ? "Low Stock"
                        : "In Stock"
            };
        }
    }
}
