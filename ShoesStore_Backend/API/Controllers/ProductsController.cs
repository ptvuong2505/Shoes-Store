using Application.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
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
            if(productDetail == null)
            {
                return NotFound();
            }
            return Ok(productDetail);
        }
    }
}
