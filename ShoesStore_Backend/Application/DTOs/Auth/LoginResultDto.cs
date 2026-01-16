using Application.DTOs.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth
{
    public record LoginResultDto(string AccessToken, string RefreshToken ,UserDto userDto);
}
