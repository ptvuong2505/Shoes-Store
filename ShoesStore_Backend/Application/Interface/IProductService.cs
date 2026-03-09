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
        Task<FiltersDto> GetFiltersAsync();
        Task<ProductDetailDto> GetProductDetailAsync(string id);
    }
}
