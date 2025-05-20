using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;

namespace SmartEvent.Core.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(string id);
        Task<Event> CreateEventAsync(Event eventEntity);
        Task<Event?> UpdateEventAsync(string id, Event eventEntity);
        Task<bool> DeleteEventAsync(string id);
    }
}
