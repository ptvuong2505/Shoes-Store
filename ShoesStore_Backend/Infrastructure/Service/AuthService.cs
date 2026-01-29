using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Account;
using Application.DTOs.Auth;
using Application.Interface;
using Domain.Entities;
using Domain.Identity;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Service
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        public AuthService(AppDbContext context, UserManager<ApplicationUser> userManager 
            ,SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, 
            IJwtTokenService jwtTokenService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<SendOtpResultDto> SendOtpAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null)
            {
                throw new InvalidOperationException("Email not found.");
            }
            var otp = new Random().Next(100000, 999999).ToString();
            var pwOtp = new PasswordResetOtp
            {
                UserId = user.Id,
                OtpHash = HashOtp(otp),
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };
            await _context.PasswordResetOtps.AddAsync(pwOtp);
            await _context.SaveChangesAsync();
            return new SendOtpResultDto
            (
                Otp: otp,
                Email: user.Email!,
                UserName: user.UserName!
            );
        }

        private string HashOtp(string otp)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(otp));
            return Convert.ToBase64String(bytes);
        }

        public async Task<LoginResultDto> LoginAsync(string email, string password, bool isRemember)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);

            if (result.IsLockedOut)
            {
                throw new UnauthorizedAccessException("User account is locked out.");
            }

            if (!result.Succeeded)
            {
                throw new UnauthorizedAccessException("Invalid password");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenService.CreateAccessToken(user, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken();

            await _context.RefreshTokens.AddAsync(new RefreshToken
            {
                Token = refreshToken!,
                UserId = user.Id,
                ExpiresAt = isRemember ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddHours(2),
            });

            await _context.SaveChangesAsync();

            return new LoginResultDto
            (
                accessToken!,
                refreshToken!,
                new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    Roles = roles.ToList()
                }
            );
        }

        public async Task<RegisterResultDto> RegisterAsync(string userName, string email, string phone, string password, string confirmPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user != null)
            {
                throw new InvalidOperationException("Email is already registered.");
            }

            if(password != confirmPassword)
            {
                throw new InvalidOperationException("Password and confirm password do not match.");
            }

            var newUser = new ApplicationUser
            {
                UserName = email,
                Email = email,
                PhoneNumber = phone,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser, password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"User registration failed:\n {errors}");
            }

            if(await _roleManager.RoleExistsAsync("User"))
            {
                await _userManager.AddToRoleAsync(newUser, "User");
            }

            return new RegisterResultDto
            (
                newUser.Id,
                newUser.UserName!,
                newUser.Email!
            );
        }

        public async Task VerifyOtpAsync(string email, string otp)
        {
            var user = _userManager.FindByEmailAsync(email).Result;
            if (user == null)
            {
                throw new InvalidOperationException("Email not found.");
            }
            var pwOtp = await _context.PasswordResetOtps.Where(o => o.UserId == user.Id && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.ExpiresAt)
                .FirstOrDefaultAsync();
            if (pwOtp == null)
                throw new InvalidOperationException("No valid OTP found or OTP is Expired.");

            if(pwOtp.IsUsed)
                throw new InvalidOperationException("OTP has already been used.");

            if (pwOtp.OtpHash != HashOtp(otp))
                throw new InvalidOperationException("Invalid OTP.");
            pwOtp.IsUsed = true;
            await _context.SaveChangesAsync();
        }
    }
}
