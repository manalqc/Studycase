using Microsoft.EntityFrameworkCore;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await GetByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User> CreateUserAsync(User user)
        {
            return await AddAsync(user);
        }

        public async Task<User?> UpdateUserAsync(string id, User user)
        {
            var existingUser = await GetUserByIdAsync(id);
            if (existingUser == null)
                return null;

            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            existingUser.IsAdmin = user.IsAdmin;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            return await DeleteAsync(id);
        }
    }
}
