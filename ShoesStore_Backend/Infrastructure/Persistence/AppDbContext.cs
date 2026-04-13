using Domain.Entities;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Domain entities DbSets
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<PasswordResetOtp> PasswordResetOtps => Set<PasswordResetOtp>();
        public DbSet<Address> Addresses => Set<Address>();
        public DbSet<ProductInventory> ProductInventories => Set<ProductInventory>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Size> Sizes => Set<Size>();
        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Mapping Domain entities to database tables
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<ApplicationRole>().ToTable("Roles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");

            // Config Entites

            // Address
            builder.Entity<Address>(e =>
            {
                e.ToTable("Addresses");

                e.HasOne(x => x.User)
                 .WithMany(u => u.Addresses)
                 .HasForeignKey(x => x.UserId);
            });

            // ProductInventory (PK kép)
            builder.Entity<ProductInventory>(e =>
            {
                e.HasKey(x => new { x.ProductId, x.SizeId });

                e.HasOne(x => x.Product)
                 .WithMany(p => p.Inventories)
                 .HasForeignKey(x => x.ProductId);

                e.HasOne(x => x.Size)
                 .WithMany(s => s.Inventories)
                 .HasForeignKey(x => x.SizeId);
            });

            // CartItem
            builder.Entity<CartItem>(e =>
            {
                e.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId);

                e.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId);

                e.HasOne(x => x.Size)
                .WithMany()
                .HasForeignKey(x => x.SizeId);
            });

            // Order
            builder.Entity<Order>(e =>
            {
                e.HasOne(x => x.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(x => x.UserId);

                e.HasOne(x => x.Address)
                .WithMany()
                .HasForeignKey(x => x.AddressId);

                e.HasOne(x => x.Payment)
                .WithOne(e => e.Order)
                .HasForeignKey<Payment>(x => x.OrderId)
                .IsRequired(false);
            });

            // OrderItem
            builder.Entity<OrderItem>(e =>
            {
                e.HasOne(x => x.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(x => x.OrderId);
            });

            // Payment (1–1)
            builder.Entity<Payment>(e =>
            {
                e.HasOne(x => x.Order)
                 .WithOne(o => o.Payment)
                 .HasForeignKey<Payment>(x => x.OrderId);
            });

            // Review
            builder.Entity<Review>(e =>
            {
                e.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId);

                e.HasOne(x => x.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(x => x.ProductId);
            });


            builder.Entity<RefreshToken>(e =>
            {            
                e.HasKey(x => x.Id);
                
                e.Property(x=>x.Token).IsRequired().HasMaxLength(500);

                e.HasIndex(x => x.Token).IsUnique();

                e.HasOne(x=>x.User).WithMany().HasForeignKey(x=> x.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PasswordResetOtp>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x=>x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);

                e.Property(x => x.OtpHash).IsRequired().HasMaxLength(64);

                e.Property(x => x.ExpiresAt).IsRequired();

                e.Property(x => x.IsUsed).HasDefaultValue(false);

                e.HasIndex(x => new { x.UserId, x.OtpHash });
            });

            // Product
            builder.Entity<Product>(e =>
            {
                e.HasMany(p => p.Images).WithOne(pi => pi.Product).HasForeignKey(pi => pi.ProductId).OnDelete(DeleteBehavior.Cascade);
            });
            
        }
    }
}
