using Application.DTOs.Account;
using Application.DTOs.Address;

namespace Application.Interfaces
{
    public interface IAccountService
    {
        Task<UserDto> GetProfile(string Id);
        Task UpdateUserAvatar(string Id, string avatarUrl);
        Task<UserDto> UpdateProfile(string Id, UpdateProfileDto updateProfileDto);
        Task<List<AddressDto>> GetAddress(string Id);
        Task SetPrimaryAddress(string userId, string addressId);
        Task DeleteAddress(string userId, string addressId);
        Task CreateAddress(string userId, CreateAddressDto dto);
        Task<bool> ChangePassword(string userId, string currentPass, string newPass);
    }
}
