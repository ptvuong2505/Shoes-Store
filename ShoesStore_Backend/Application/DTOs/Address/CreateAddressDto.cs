namespace Application.DTOs.Address
{
    public record CreateAddressDto(string ReceiverName, string Phone, string AddressLine, string City, bool IsPrimary);
}
