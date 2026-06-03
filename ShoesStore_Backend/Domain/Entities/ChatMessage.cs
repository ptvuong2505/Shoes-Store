using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ChatMessage
    {
        public Guid Id { get; set; }

        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }

        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }

        public DateTime SentAt { get; set; }
    }

}
