using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartEvent.Core.DTOs;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartEvent.Services.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;

        public UserService(IUserRepository userRepository, IOptions<JwtSettings> jwtSettings)
        {
            _userRepository = userRepository;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<ApiResponse<User?>> GetCurrentUserAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return ApiResponse<User?>.FailureResponse("User not found");
            }

            return ApiResponse<User?>.SuccessResponse(user);
        }

        public async Task<ApiResponse<User>> RegisterUserAsync(string name, string email, bool isAdmin)
        {
            // Check if user with this email already exists
            var existingUser = await _userRepository.GetUserByEmailAsync(email);
            
            if (existingUser != null)
            {
                // If user exists, just return the existing user with a new token
                var token = GenerateJwtToken(existingUser);
                existingUser.Token = token;
                return ApiResponse<User>.SuccessResponse(existingUser);
            }

            // Create new user
            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = name,
                Email = email,
                IsAdmin = isAdmin
            };

            var createdUser = await _userRepository.CreateUserAsync(newUser);
            
            // Generate JWT token
            var jwtToken = GenerateJwtToken(createdUser);
            createdUser.Token = jwtToken;

            return ApiResponse<User>.SuccessResponse(createdUser);
        }

        public async Task<ApiResponse<User>> LoginUserAsync(string email)
        {
            var user = await _userRepository.GetUserByEmailAsync(email);
            
            if (user == null)
            {
                return ApiResponse<User>.FailureResponse("User not found");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            user.Token = token;

            return ApiResponse<User>.SuccessResponse(user);
        }

        public Task<ApiResponse<bool>> LogoutAsync()
        {
            // In a stateless JWT system, logout is handled client-side by removing the token
            return Task.FromResult(ApiResponse<bool>.SuccessResponse(true));
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    // Add this class to User model or create a separate file
    public class JwtSettings
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpiryInMinutes { get; set; } = 60;
    }
}
