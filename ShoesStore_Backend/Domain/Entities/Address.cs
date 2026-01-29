using Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Address
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string ReceiverName { get; set; }
        public string Phone { get; set; }
        public string AddressLine { get; set; }

        public ApplicationUser User { get; set; }
    }

}
