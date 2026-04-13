using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Account
{
    public class UpdateProfileDto
    {
        public string UserName { get; set; }
        public string Phone { get; set; }
        public DateTimeOffset? BirthDate { get; set; }
    }

}
