using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartEvent.Core.Models
{
    public class Registration
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string EventId { get; set; } = string.Empty;
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        
        public bool Attended { get; set; } = false;
        
        [ForeignKey("EventId")]
        public Event? Event { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
