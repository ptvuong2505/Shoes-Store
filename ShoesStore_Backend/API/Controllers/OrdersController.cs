using Application.DTOs.Order;
using Application.Interfaces;
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

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/dashboard")]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var result = await _orderService.GetAdminDashboardAsync();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders(
                [FromQuery] int page = 1,
                [FromQuery] int pageSize = 10)
        {
            // Lấy userId từ JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
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
            if (userId == null)
            {
                return Unauthorized();
            }

            var order = await _orderService.GetOrderDetailAsync(userId, id);

            if (order == null) return NotFound();

            return Ok(order);
        }

        [Authorize]
        [HttpPost("buy-now")]
        public async Task<IActionResult> BuyNow([FromBody] BuyNowRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }
            var orderId = await _orderService.BuyNowAsync(userId, request);
            if (orderId == null)
            {
                return BadRequest(new { Message = "Failed to create order." });
            }
            return Ok(orderId);
        }

        [Authorize]
        [HttpPost("checkout")]
        public async Task<IActionResult> CheckoutCart([FromBody] List<BuyNowRequest> requests)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var orderId = await _orderService.CheckoutCartAsync(userId, requests);
                return Ok(orderId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("checkout/{orderId}")]
        public async Task<IActionResult> GetOrderCheckoutInfo(string orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }
            var checkoutInfo = await _orderService.GetOrderCheckoutInfoAsync(userId, orderId);
            if (checkoutInfo == null)
            {
                return NotFound(new { Message = "Order not found." });
            }
            return Ok(checkoutInfo);
        }

        [Authorize]
        [HttpPost("payment/{orderId}")]
        public async Task<IActionResult> ProcessPayment(string orderId, [FromBody] ProcessPaymentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.SelectedAddressId))
            {
                return BadRequest(new { Message = "selectedAddressId is required." });
            }

            try
            {
                await _orderService.PaymentAsync(userId, orderId, request.SelectedAddressId);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            return Ok(new { Message = "Payment processed successfully." });
        }
    }
}
