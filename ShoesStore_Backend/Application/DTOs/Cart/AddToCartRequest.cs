namespace Application.DTOs.Cart
{
    public class AddToCartRequest
    {
        public string ProductId { get; set; } = string.Empty;
        public int Size { get; set; }
        public int Quantity { get; set; }
    }
}
