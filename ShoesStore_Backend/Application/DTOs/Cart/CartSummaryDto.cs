namespace Application.DTOs.Cart
{
    public class CartSummaryDto
    {
        public int SelectedItems { get; set; }
        public decimal SelectedSubtotal { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal EstimatedTax { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
