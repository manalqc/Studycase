using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.Core.Models;
using SmartEvent.Core.DTOs;

namespace SmartEvent.Core.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<User?>> GetCurrentUserAsync(string userId);
        Task<ApiResponse<User>> RegisterUserAsync(string name, string email, bool isAdmin);
        Task<ApiResponse<User>> LoginUserAsync(string email);
        Task<ApiResponse<bool>> LogoutAsync();
    }
}
