using Application.Common.Responses;
using Application.DTOs.Paging;
using Application.DTOs.Product;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProduct([FromQuery] ProductFilter productFilter)
        {
            var products = await _productService.GetAllProductsAsync(productFilter);
            return Ok(ApiResponse<PagedResult<ProductDto>>.Ok(products, "Products retrieved successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminProducts([FromQuery] AdminProductFilter filter)
        {
            var result = await _productService.GetAdminProductsAsync(filter);
            return Ok(ApiResponse<AdminProductListDto>.Ok(result, "Admin products retrieved successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin")]
        public async Task<IActionResult> CreateAdminProduct([FromBody] AdminUpsertProductRequest request)
        {
            var result = await _productService.CreateAdminProductAsync(request);
            return StatusCode(
                StatusCodes.Status201Created,
                ApiResponse<AdminProductItemDto>.Created(result, "Product created successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> UpdateAdminProduct(string id, [FromBody] AdminUpsertProductRequest request)
        {
            var result = await _productService.UpdateAdminProductAsync(id, request);
            return Ok(ApiResponse<AdminProductItemDto>.Ok(result, "Product updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> DeleteAdminProduct(string id)
        {
            await _productService.DeleteAdminProductAsync(id);
            return Ok(ApiResponse<object?>.Ok(null, "Product deleted successfully."));
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFiltersAsync()
        {
            var filters = await _productService.GetFiltersAsync();
            return Ok(ApiResponse<FiltersDto>.Ok(filters, "Filters retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetailByIdAsync(string id)
        {
            var productDetail = await _productService.GetProductDetailAsync(id);
            return Ok(ApiResponse<ProductDetailDto>.Ok(productDetail, "Product detail retrieved successfully."));
        }
    }
}
