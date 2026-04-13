using Application.DTOs.Account;
using Application.DTOs.Address;
using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IAccountService
    {
        public Task<UserDto> GetProfile(string Id);
        public Task<ApplicationUser?> GetUser(string Id);
        public Task UpdateUserAvatar(string Id, string avatarUrl);
        public Task<UserDto> UpdateProfile(string Id, UpdateProfileDto updateProfileDto);
        public Task<List<AddressDto>> GetAddress(string Id);
        public Task SetPrimaryAddress(string userId, string addressId);
        public Task DeleteAddress(string userId, string addressId);
        public Task CreateAddress(string userId, CreateAddressDto dto);
        public Task<bool> ChangePassword(string userId, string currentPass, string newPass);
    }
}
