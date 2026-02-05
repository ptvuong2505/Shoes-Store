using Application.DTOs.Account;
using Application.Interface;
using Domain.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
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
                Roles = (await _userManager.GetRolesAsync(user)).ToList()
            };
        }

        public async Task<ApplicationUser?> GetUser(string Id)
        {
            return await _userManager.FindByIdAsync(Id);
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
