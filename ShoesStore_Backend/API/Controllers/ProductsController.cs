using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Application.DTOs.Product;

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

        //public async Task<IActionResult> GetTrendingProductsAsync()
        //{

        //}

        [HttpGet]
        public async Task<IActionResult> GetAllProduct([FromQuery] ProductFilter productFilter)
        {
            var products = await _productService.GetAllProductsAsync(productFilter);
            return Ok(products);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAdminProducts([FromQuery] AdminProductFilter filter)
        {
            var result = await _productService.GetAdminProductsAsync(filter);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin")]
        public async Task<IActionResult> CreateAdminProduct([FromBody] AdminUpsertProductRequest request)
        {
            var result = await _productService.CreateAdminProductAsync(request);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> UpdateAdminProduct(string id, [FromBody] AdminUpsertProductRequest request)
        {
            var result = await _productService.UpdateAdminProductAsync(id, request);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> DeleteAdminProduct(string id)
        {
            var deleted = await _productService.DeleteAdminProductAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFiltersAsync()
        {
            var filters = await _productService.GetFiltersAsync();
            return Ok(filters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetailByIdAsync(string id)
        {
            var productDetail = await _productService.GetProductDetailAsync(id);
            if (productDetail == null)
            {
                return NotFound();
            }
            return Ok(productDetail);
        }
    }
}
