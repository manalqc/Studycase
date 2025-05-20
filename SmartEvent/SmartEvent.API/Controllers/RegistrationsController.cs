using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using SmartEvent.Core.DTOs;

namespace SmartEvent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;

        public RegistrationsController(IRegistrationService registrationService)
        {
            _registrationService = registrationService;
        }

        [HttpGet("event/{eventId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<Registration>>>> GetRegistrationsByEventId(string eventId)
        {
            var response = await _registrationService.GetRegistrationsByEventIdAsync(eventId);
            
            if (!response.Success)
            {
                return NotFound(response);
            }
            
            return Ok(response);
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<Registration>>>> GetUserRegistrations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<List<Registration>>.FailureResponse("Not authenticated"));
            }

            var response = await _registrationService.GetRegistrationsByUserIdAsync(userId);
            return Ok(response);
        }

        [HttpPost("{eventId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Registration>>> RegisterForEvent(string eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<Registration>.FailureResponse("Not authenticated"));
            }

            var response = await _registrationService.RegisterForEventAsync(eventId, userId);
            
            if (!response.Success)
            {
                if (response.Message == "Event not found" || response.Message == "User not found")
                {
                    return NotFound(response);
                }
                
                if (response.Message == "User is already registered for this event")
                {
                    return Conflict(response);
                }
                
                if (response.Message == "Event has reached maximum capacity")
                {
                    return BadRequest(response);
                }
                
                return BadRequest(response);
            }
            
            return CreatedAtAction(nameof(GetRegistrationsByEventId), new { eventId = response.Data.EventId }, response);
        }

        [HttpDelete("{eventId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> CancelRegistration(string eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<bool>.FailureResponse("Not authenticated"));
            }

            var response = await _registrationService.CancelRegistrationAsync(eventId, userId);
            
            if (!response.Success)
            {
                if (response.Message == "Event not found" || response.Message == "User not found" || response.Message == "Registration not found")
                {
                    return NotFound(response);
                }
                
                return BadRequest(response);
            }
            
            return Ok(response);
        }
    }
}
