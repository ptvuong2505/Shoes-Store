using Application.DTOs.Account;
using Application.DTOs.Address;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        Task<UserDto> GetProfileAsync(string userId);
        Task<UserDto> UpdateProfileAsync(string userId, UpdateProfileDto dto);
        Task UpdateAvatarAsync(string userId, string avatarUrl);
        Task ChangePasswordAsync(string userId, string currentPassword, string newPassword);
        Task<List<AddressDto>> GetAddressesAsync(string userId);
        Task CreateAddressAsync(string userId, CreateAddressDto dto);
        Task SetPrimaryAddressAsync(string userId, string addressId);
        Task DeleteAddressAsync(string userId, string addressId);
        Task<List<UserReviewDto>> GetReviewsAsync(string userId);
    }
}
