using Microsoft.EntityFrameworkCore;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartEvent.Data.Repositories
{
    public class RegistrationRepository : BaseRepository<Registration>, IRegistrationRepository
    {
        public RegistrationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Registration>> GetAllRegistrationsAsync()
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .ToListAsync();
        }

        public async Task<Registration?> GetRegistrationByIdAsync(string id)
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Registration>> GetRegistrationsByEventIdAsync(string eventId)
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .Where(r => r.EventId == eventId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Registration>> GetRegistrationsByUserIdAsync(string userId)
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<Registration?> GetRegistrationByEventAndUserIdAsync(string eventId, string userId)
        {
            return await _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.EventId == eventId && r.UserId == userId);
        }

        public async Task<Registration> CreateRegistrationAsync(Registration registration)
        {
            return await AddAsync(registration);
        }

        public async Task<bool> DeleteRegistrationAsync(string id)
        {
            return await DeleteAsync(id);
        }

        public async Task<bool> DeleteRegistrationByEventAndUserIdAsync(string eventId, string userId)
        {
            var registration = await GetRegistrationByEventAndUserIdAsync(eventId, userId);
            if (registration == null)
                return false;

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
