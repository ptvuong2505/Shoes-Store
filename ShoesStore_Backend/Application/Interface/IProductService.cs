using Application.DTOs.Paging;
using Application.DTOs.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetTrendingProductsAsync();
        Task<PagedResult<ProductDto>> GetAllProductsAsync(ProductFilter productFilter);
        Task<AdminProductListDto> GetAdminProductsAsync(AdminProductFilter filter);
        Task<AdminProductItemDto> CreateAdminProductAsync(AdminUpsertProductRequest request);
        Task<AdminProductItemDto?> UpdateAdminProductAsync(string id, AdminUpsertProductRequest request);
        Task<bool> DeleteAdminProductAsync(string id);
        Task<FiltersDto> GetFiltersAsync();
        Task<ProductDetailDto> GetProductDetailAsync(string id);
    }
}
