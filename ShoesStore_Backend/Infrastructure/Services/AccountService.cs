using Application.DTOs.Account;
using Application.DTOs.Address;
using Application.Interfaces;
using Domain.Entities;
using Domain.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<bool> ChangePassword(string userId, string currentPass, string newPass)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var result =  await _userManager.ChangePasswordAsync(user, currentPass, newPass);

            return result.Succeeded;
        }

        public async Task CreateAddress(string userId, CreateAddressDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var addresses = await _context.Addresses
                .Where(x => x.UserId.ToString() == userId)
                .ToListAsync();

            bool isFirstAddress = !addresses.Any();

            if (dto.IsPrimary || isFirstAddress)
            {
                foreach (var address in addresses)
                {
                    address.IsPrimary = false;
                }
            }

            var newAddress = new Address
            {
                Id = Guid.NewGuid(),
                ReceiverName = dto.ReceiverName,
                Phone = dto.Phone,
                AddressLine = dto.AddressLine,
                City = dto.City,
                IsPrimary = dto.IsPrimary || isFirstAddress,
                UserId = Guid.Parse(userId)
            };

            await _context.Addresses.AddAsync(newAddress);
            await _context.SaveChangesAsync();
        }


        public async Task DeleteAddress(string userId, string addressId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var address = await _context.Addresses.FirstOrDefaultAsync(x => x.Id.ToString() == addressId && x.UserId.ToString() == userId);

            if (address == null)
                throw new Exception("Address not found");

            bool wasPrimary = address.IsPrimary;

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            // Nếu xóa default → set cái đầu tiên làm default
            if (wasPrimary)
            {
                var firstAddress = await _context.Addresses
                    .Where(x => x.UserId.ToString() == userId)
                    .FirstOrDefaultAsync();

                if (firstAddress != null)
                {
                    firstAddress.IsPrimary = true;
                    await _context.SaveChangesAsync();
                }
            }
        }


        public async Task<List<AddressDto>> GetAddress(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
                throw new Exception("User not found");

            var accdresses = await _context.Addresses.Where(a=> a.UserId == user.Id).Select(i=> new AddressDto
            {
                Id = i.Id,
                UserId = user.Id,
                AddressLine = i.AddressLine,
                City = i.City,
                IsPrimary = i.IsPrimary,
                Phone  = i.Phone,
                ReceiverName = i.ReceiverName,
            }).ToListAsync();

            return accdresses;
        }

        public async Task<UserDto> GetProfile(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if(user == null)
            {
                throw new Exception("User not found");
            }
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

        public async Task SetPrimaryAddress(string userId, string addressId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");
            
            var addresses = await _context.Addresses.Where(x => x.UserId.ToString() == userId).ToListAsync();

            foreach (var address in addresses)
            {
                address.IsPrimary = address.Id.ToString() == addressId;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<UserDto> UpdateProfile(string Id, UpdateProfileDto updateProfileDto)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.UserName = updateProfileDto.UserName;
            user.PhoneNumber = updateProfileDto.Phone;
            if (updateProfileDto.BirthDate.HasValue)
            {
                user.BirthDate = updateProfileDto.BirthDate.Value;
            }
            await _userManager.UpdateAsync(user);
            Console.WriteLine("Profile updated successfully.");
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

        public async Task UpdateUserAvatar(string Id, string avatarUrl)
        {
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            user.AvatarUrl = avatarUrl;
            await _userManager.UpdateAsync(user);
        }
    }
}
