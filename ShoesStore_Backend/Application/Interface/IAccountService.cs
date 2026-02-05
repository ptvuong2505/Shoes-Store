using Application.DTOs.Account;
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
    }
}
