using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IImageService
    {
        Task<byte[]> ConvertToWebpAsync(Stream imageStream);
        public Task<string> UploadAvatarAsync(Stream imageStream);
    }
}
