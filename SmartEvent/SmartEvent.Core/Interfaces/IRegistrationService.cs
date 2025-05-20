using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;
using SmartEvent.Core.DTOs;

namespace SmartEvent.Core.Interfaces
{
    public interface IRegistrationService
    {
        Task<ApiResponse<List<Registration>>> GetRegistrationsByEventIdAsync(string eventId);
        Task<ApiResponse<List<Registration>>> GetRegistrationsByUserIdAsync(string userId);
        Task<ApiResponse<Registration>> RegisterForEventAsync(string eventId, string userId);
        Task<ApiResponse<bool>> CancelRegistrationAsync(string eventId, string userId);
    }
}
