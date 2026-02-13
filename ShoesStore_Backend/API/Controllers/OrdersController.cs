using Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {

        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders(
                [FromQuery] int page = 1,
                [FromQuery] int pageSize = 10)
        {
            // Lấy userId từ JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null)
            {
                return Unauthorized(new { Message = "User ID claim not found." });
            }

            var result = await _orderService.GetUserOrdersAsync(
                userId,
                page,
                pageSize
            );

            return Ok(result);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) { 
                return Unauthorized();
            }

            var order = await _orderService.GetOrderDetailAsync(userId, id);

            if (order == null) return NotFound();

            Console.WriteLine($"{"Itemsssssss: " + order.Items.Count()}");
            return Ok(order);
        }

    }
}
