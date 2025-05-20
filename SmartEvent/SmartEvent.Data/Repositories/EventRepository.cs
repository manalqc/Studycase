using Microsoft.EntityFrameworkCore;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.Data.Repositories
{
    public class EventRepository : BaseRepository<Event>, IEventRepository
    {
        public EventRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                .Include(e => e.Creator)
                .ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(string id)
        {
            return await _context.Events
                .Include(e => e.Creator)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event> CreateEventAsync(Event eventEntity)
        {
            return await AddAsync(eventEntity);
        }

        public async Task<Event?> UpdateEventAsync(string id, Event eventEntity)
        {
            var existingEvent = await GetEventByIdAsync(id);
            if (existingEvent == null)
                return null;

            // Update properties
            existingEvent.Title = eventEntity.Title;
            existingEvent.Description = eventEntity.Description;
            existingEvent.Location = eventEntity.Location;
            existingEvent.StartDate = eventEntity.StartDate;
            existingEvent.EndDate = eventEntity.EndDate;
            existingEvent.Capacity = eventEntity.Capacity;
            existingEvent.ImageUrl = eventEntity.ImageUrl;
            existingEvent.Category = eventEntity.Category;

            await _context.SaveChangesAsync();
            return existingEvent;
        }

        public async Task<bool> DeleteEventAsync(string id)
        {
            return await DeleteAsync(id);
        }
    }
}
