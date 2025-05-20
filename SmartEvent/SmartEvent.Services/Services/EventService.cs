using SmartEvent.Core.DTOs;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.Services.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;

        public EventService(IEventRepository eventRepository, IUserRepository userRepository)
        {
            _eventRepository = eventRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<List<Event>>> GetAllEventsAsync()
        {
            var events = await _eventRepository.GetAllEventsAsync();
            return ApiResponse<List<Event>>.SuccessResponse(events.ToList());
        }

        public async Task<ApiResponse<Event>> GetEventByIdAsync(string id)
        {
            var eventItem = await _eventRepository.GetEventByIdAsync(id);

            if (eventItem == null)
            {
                return ApiResponse<Event>.FailureResponse("Event not found");
            }

            return ApiResponse<Event>.SuccessResponse(eventItem);
        }

        public async Task<ApiResponse<Event>> CreateEventAsync(Event eventData, string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<Event>.FailureResponse("User not found");
            }

            eventData.Id = Guid.NewGuid().ToString();
            eventData.CreatedBy = userId;
            eventData.CreatedAt = DateTime.UtcNow;

            var createdEvent = await _eventRepository.CreateEventAsync(eventData);
            return ApiResponse<Event>.SuccessResponse(createdEvent);
        }

        public async Task<ApiResponse<Event>> UpdateEventAsync(string id, Event eventData, string userId)
        {
            var existingEvent = await _eventRepository.GetEventByIdAsync(id);

            if (existingEvent == null)
            {
                return ApiResponse<Event>.FailureResponse("Event not found");
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<Event>.FailureResponse("User not found");
            }

            // Check if user is admin or the creator of the event
            if (!user.IsAdmin && existingEvent.CreatedBy != userId)
            {
                return ApiResponse<Event>.FailureResponse("Not authorized to update this event");
            }

            var updatedEvent = await _eventRepository.UpdateEventAsync(id, eventData);
            if (updatedEvent == null)
            {
                return ApiResponse<Event>.FailureResponse("Failed to update event");
            }

            return ApiResponse<Event>.SuccessResponse(updatedEvent);
        }

        public async Task<ApiResponse<bool>> DeleteEventAsync(string id, string userId)
        {
            var eventToDelete = await _eventRepository.GetEventByIdAsync(id);

            if (eventToDelete == null)
            {
                return ApiResponse<bool>.FailureResponse("Event not found");
            }

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.FailureResponse("User not found");
            }

            // Check if user is admin or the creator of the event
            if (!user.IsAdmin && eventToDelete.CreatedBy != userId)
            {
                return ApiResponse<bool>.FailureResponse("Not authorized to delete this event");
            }

            var result = await _eventRepository.DeleteEventAsync(id);
            if (!result)
            {
                return ApiResponse<bool>.FailureResponse("Failed to delete event");
            }

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
