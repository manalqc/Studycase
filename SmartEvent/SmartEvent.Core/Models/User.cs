using System;
using System.ComponentModel.DataAnnotations;

namespace SmartEvent.Core.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public bool IsAdmin { get; set; } = false;

        [System.Text.Json.Serialization.JsonIgnore]
        public string? Token { get; set; }
    }
}
