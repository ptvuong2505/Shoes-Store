using Application.Common.Errors;
using Application.Common.Exceptions;
using Application.DTOs.Account;
using Application.DTOs.Address;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class AccountService : IAccountService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<UserDto> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new NotFoundException(ErrorCodes.UserNotFound, "User not found.");

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                AvatarUrl = user.AvatarUrl,
                Roles = (await _userManager.GetRolesAsync(user)).ToList(),
                BirthDate = user.BirthDate
            };
        }

        public async Task<UserDto> UpdateProfileAsync(string userId, UpdateProfileDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new NotFoundException(ErrorCodes.UserNotFound, "User not found.");

            user.UserName = dto.UserName;
            user.PhoneNumber = dto.Phone;
            if (dto.BirthDate.HasValue)
                user.BirthDate = dto.BirthDate.Value;

            await _userManager.UpdateAsync(user);

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                AvatarUrl = user.AvatarUrl,
                Roles = (await _userManager.GetRolesAsync(user)).ToList(),
                BirthDate = user.BirthDate
            };
        }

        public async Task UpdateAvatarAsync(string userId, string avatarUrl)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new NotFoundException(ErrorCodes.UserNotFound, "User not found.");

            user.AvatarUrl = avatarUrl;
            await _userManager.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new NotFoundException(ErrorCodes.UserNotFound, "User not found.");

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (!result.Succeeded)
            {
                throw new RequestValidationException(
                    new Dictionary<string, string[]>
                    {
                        ["currentPassword"] = result.Errors
                            .Select(error => error.Description)
                            .ToArray()
                    },
                    "Password change failed.");
            }
        }

        public async Task<List<AddressDto>> GetAddressesAsync(string userId)
        {
            var uid = Guid.Parse(userId);

            return await _context.Addresses
                .Where(a => a.UserId == uid)
                .Select(a => new AddressDto
                {
                    Id = a.Id,
                    UserId = uid,
                    AddressLine = a.AddressLine,
                    City = a.City,
                    IsPrimary = a.IsPrimary,
                    Phone = a.Phone,
                    ReceiverName = a.ReceiverName,
                })
                .ToListAsync();
        }

        public async Task CreateAddressAsync(string userId, CreateAddressDto dto)
        {
            var uid = Guid.Parse(userId);

            var addresses = await _context.Addresses
                .Where(x => x.UserId == uid)
                .ToListAsync();

            bool isFirstAddress = !addresses.Any();

            if (dto.IsPrimary || isFirstAddress)
            {
                foreach (var address in addresses)
                    address.IsPrimary = false;
            }

            var newAddress = new Address
            {
                Id = Guid.NewGuid(),
                ReceiverName = dto.ReceiverName,
                Phone = dto.Phone,
                AddressLine = dto.AddressLine,
                City = dto.City,
                IsPrimary = dto.IsPrimary || isFirstAddress,
                UserId = uid
            };

            await _context.Addresses.AddAsync(newAddress);
            await _context.SaveChangesAsync();
        }

        public async Task SetPrimaryAddressAsync(string userId, string addressId)
        {
            var uid = Guid.Parse(userId);
            var aid = Guid.Parse(addressId);

            var addresses = await _context.Addresses
                .Where(x => x.UserId == uid)
                .ToListAsync();

            foreach (var address in addresses)
                address.IsPrimary = address.Id == aid;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAddressAsync(string userId, string addressId)
        {
            var uid = Guid.Parse(userId);
            var aid = Guid.Parse(addressId);

            var address = await _context.Addresses
                .FirstOrDefaultAsync(x => x.Id == aid && x.UserId == uid)
                ?? throw new NotFoundException(ErrorCodes.AddressNotFound, "Address not found.");

            bool wasPrimary = address.IsPrimary;

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            if (wasPrimary)
            {
                var firstAddress = await _context.Addresses
                    .Where(x => x.UserId == uid)
                    .FirstOrDefaultAsync();

                if (firstAddress != null)
                {
                    firstAddress.IsPrimary = true;
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
