using System;

namespace SmartEvent.Core.DTOs
{
    public class RegistrationDTO
    {
        public string Id { get; set; } = string.Empty;
        public string EventId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public DateTime RegisteredAt { get; set; }
        public bool Attended { get; set; }
        public EventDTO? Event { get; set; }
        public UserDTO? User { get; set; }
    }
}
