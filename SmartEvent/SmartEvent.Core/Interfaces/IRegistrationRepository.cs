using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;

namespace SmartEvent.Core.Interfaces
{
    public interface IRegistrationRepository
    {
        Task<IEnumerable<Registration>> GetAllRegistrationsAsync();
        Task<Registration?> GetRegistrationByIdAsync(string id);
        Task<IEnumerable<Registration>> GetRegistrationsByEventIdAsync(string eventId);
        Task<IEnumerable<Registration>> GetRegistrationsByUserIdAsync(string userId);
        Task<Registration?> GetRegistrationByEventAndUserIdAsync(string eventId, string userId);
        Task<Registration> CreateRegistrationAsync(Registration registration);
        Task<bool> DeleteRegistrationAsync(string id);
        Task<bool> DeleteRegistrationByEventAndUserIdAsync(string eventId, string userId);
    }
}
