using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;
using SmartEvent.Core.DTOs;

namespace SmartEvent.Core.Interfaces
{
    public interface IEventService
    {
        Task<ApiResponse<List<Event>>> GetAllEventsAsync();
        Task<ApiResponse<Event>> GetEventByIdAsync(string id);
        Task<ApiResponse<Event>> CreateEventAsync(Event eventData, string userId);
        Task<ApiResponse<Event>> UpdateEventAsync(string id, Event eventData, string userId);
        Task<ApiResponse<bool>> DeleteEventAsync(string id, string userId);
    }
}
