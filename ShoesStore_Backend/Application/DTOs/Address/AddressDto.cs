namespace Application.DTOs.Address
{
    public class AddressDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public string AddressLine { get; set; } = string.Empty;
    }
}
