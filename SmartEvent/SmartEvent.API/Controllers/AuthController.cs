using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.DTOs;

namespace SmartEvent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.FailureResponse("Not authenticated"));
            }

            var response = await _userService.GetCurrentUserAsync(userId);
            
            if (!response.Success)
            {
                return NotFound(response);
            }
            
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _userService.RegisterUserAsync(request.Name, request.Email, request.IsAdmin);
            
            if (!response.Success)
            {
                return BadRequest(response);
            }

            // Create response with token
            var authResponse = new AuthResponse
            {
                Token = response.Data.Token,
                User = new UserDTO
                {
                    Id = response.Data.Id,
                    Name = response.Data.Name,
                    Email = response.Data.Email,
                    IsAdmin = response.Data.IsAdmin
                }
            };

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(authResponse));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _userService.LoginUserAsync(request.Email);
            
            if (!response.Success)
            {
                return BadRequest(response);
            }

            // Create response with token
            var authResponse = new AuthResponse
            {
                Token = response.Data.Token,
                User = new UserDTO
                {
                    Id = response.Data.Id,
                    Name = response.Data.Name,
                    Email = response.Data.Email,
                    IsAdmin = response.Data.IsAdmin
                }
            };

            return Ok(ApiResponse<AuthResponse>.SuccessResponse(authResponse));
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var response = await _userService.LogoutAsync();
            return Ok(response);
        }
    }
}
