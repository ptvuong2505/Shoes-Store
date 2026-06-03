using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class ImageService : IImageService
    {
        IConfiguration _configuration;
        public ImageService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<byte[]> ConvertToWebpAsync(Stream imageStream)
        {
            using var image = await Image.LoadAsync(imageStream);
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size(512, 512),
                Mode = ResizeMode.Crop
            }));

            using var ms = new MemoryStream();
            await image.SaveAsync(ms, new WebpEncoder { Quality = 80 });

            return ms.ToArray();
        }

        public async Task<string> UploadAvatarAsync(Stream imageStream)
        {
            byte[] imageBytes = await ConvertToWebpAsync(imageStream);
            return await UploadToSupabaseAsync(imageBytes);
        }

        public async Task<string> UploadToSupabaseAsync(byte[] imageBytes)
        {
            var fileName = $"{Guid.NewGuid()}.webp";

            string _supabaseUrl = _configuration["Supabase:Url"]!;
            string _supabaseKey = _configuration["Supabase:Service_Role_Key"]!;
            var supabase = new Supabase.Client(_supabaseUrl,_supabaseKey);

            var bucket = supabase.Storage.From("avatars");

            await bucket.Upload(imageBytes, fileName, new Supabase.Storage.FileOptions
            {
                ContentType = "image/webp",
                Upsert = true
            });

            return bucket.GetPublicUrl(fileName);
        }
    }
}
