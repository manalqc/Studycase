using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;

namespace SmartEvent.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(string id, User user);
        Task<bool> DeleteUserAsync(string id);
    }
}
