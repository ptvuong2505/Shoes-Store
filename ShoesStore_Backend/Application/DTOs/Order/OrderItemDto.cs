namespace Application.DTOs.Order
{
    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Size { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }

}
