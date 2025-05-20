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
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Event>>>> GetAllEvents()
        {
            var response = await _eventService.GetAllEventsAsync();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Event>>> GetEventById(string id)
        {
            var response = await _eventService.GetEventByIdAsync(id);
            
            if (!response.Success)
            {
                return NotFound(response);
            }
            
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Event>>> CreateEvent([FromBody] CreateEventRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<Event>.FailureResponse("Not authenticated"));
            }

            // Map request to Event model
            var eventData = new Event
            {
                Title = request.Title,
                Description = request.Description,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Capacity = request.Capacity,
                ImageUrl = request.ImageUrl,
                Category = request.Category
            };

            var response = await _eventService.CreateEventAsync(eventData, userId);
            return CreatedAtAction(nameof(GetEventById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Event>>> UpdateEvent(string id, [FromBody] UpdateEventRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<Event>.FailureResponse("Not authenticated"));
            }

            // Map request to Event model
            var eventData = new Event
            {
                Title = request.Title,
                Description = request.Description,
                Location = request.Location,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Capacity = request.Capacity,
                ImageUrl = request.ImageUrl,
                Category = request.Category
            };

            var response = await _eventService.UpdateEventAsync(id, eventData, userId);
            
            if (!response.Success)
            {
                if (response.Message == "Event not found")
                {
                    return NotFound(response);
                }
                
                if (response.Message == "Not authorized to update this event")
                {
                    return Forbid();
                }
                
                return BadRequest(response);
            }
            
            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteEvent(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<bool>.FailureResponse("Not authenticated"));
            }

            var response = await _eventService.DeleteEventAsync(id, userId);
            
            if (!response.Success)
            {
                if (response.Message == "Event not found")
                {
                    return NotFound(response);
                }
                
                if (response.Message == "Not authorized to delete this event")
                {
                    return Forbid();
                }
                
                return BadRequest(response);
            }
            
            return Ok(response);
        }
    }
}
