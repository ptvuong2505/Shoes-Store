namespace Application.DTOs.Order
{
    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Size { get; set; }
        public string Gender { get; set; }
    }

}
