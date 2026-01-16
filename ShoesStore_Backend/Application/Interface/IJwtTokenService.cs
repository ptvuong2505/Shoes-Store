using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IJwtTokenService
    {
        string? CreateAccessToken(ApplicationUser user, IList<string> roles);
        string? CreateRefreshToken();
    }
}
