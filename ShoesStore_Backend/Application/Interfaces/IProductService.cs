using Application.DTOs.Paging;
using Application.DTOs.Product;

namespace Application.Interfaces;

public interface IProductService
{
    Task<List<ProductDto>> GetTrendingProductsAsync();
    Task<PagedResult<ProductDto>> GetAllProductsAsync(ProductFilter productFilter);
    Task<AdminProductListDto> GetAdminProductsAsync(AdminProductFilter filter);
    Task<AdminProductItemDto> CreateAdminProductAsync(AdminUpsertProductRequest request);
    Task<AdminProductItemDto> UpdateAdminProductAsync(string id, AdminUpsertProductRequest request);
    Task DeleteAdminProductAsync(string id);
    Task<FiltersDto> GetFiltersAsync();
    Task<ProductDetailDto> GetProductDetailAsync(string id);
}
