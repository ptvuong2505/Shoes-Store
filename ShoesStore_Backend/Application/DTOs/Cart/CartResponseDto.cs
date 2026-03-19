namespace Application.DTOs.Cart
{
    public class CartResponseDto
    {
        public List<CartItemDto> Items { get; set; } = [];
        public CartSummaryDto? Summary { get; set; }
    }
}
