using SmartEvent.Core.DTOs;
using SmartEvent.Core.Interfaces;
using SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.Services.Services
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;

        public RegistrationService(
            IRegistrationRepository registrationRepository,
            IEventRepository eventRepository,
            IUserRepository userRepository)
        {
            _registrationRepository = registrationRepository;
            _eventRepository = eventRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<List<Registration>>> GetRegistrationsByEventIdAsync(string eventId)
        {
            var eventEntity = await _eventRepository.GetEventByIdAsync(eventId);
            if (eventEntity == null)
            {
                return ApiResponse<List<Registration>>.FailureResponse("Event not found");
            }

            var registrations = await _registrationRepository.GetRegistrationsByEventIdAsync(eventId);
            return ApiResponse<List<Registration>>.SuccessResponse(registrations.ToList());
        }

        public async Task<ApiResponse<List<Registration>>> GetRegistrationsByUserIdAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<List<Registration>>.FailureResponse("User not found");
            }

            var registrations = await _registrationRepository.GetRegistrationsByUserIdAsync(userId);
            return ApiResponse<List<Registration>>.SuccessResponse(registrations.ToList());
        }

        public async Task<ApiResponse<Registration>> RegisterForEventAsync(string eventId, string userId)
        {
            // Check if event exists
            var eventEntity = await _eventRepository.GetEventByIdAsync(eventId);
            if (eventEntity == null)
            {
                return ApiResponse<Registration>.FailureResponse("Event not found");
            }

            // Check if user exists
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<Registration>.FailureResponse("User not found");
            }

            // Check if user is already registered for this event
            var existingRegistration = await _registrationRepository.GetRegistrationByEventAndUserIdAsync(eventId, userId);
            if (existingRegistration != null)
            {
                return ApiResponse<Registration>.FailureResponse("User is already registered for this event");
            }

            // Check if event has reached capacity
            var eventRegistrations = await _registrationRepository.GetRegistrationsByEventIdAsync(eventId);
            if (eventRegistrations.Count() >= eventEntity.Capacity)
            {
                return ApiResponse<Registration>.FailureResponse("Event has reached maximum capacity");
            }

            // Create registration
            var registration = new Registration
            {
                Id = Guid.NewGuid().ToString(),
                EventId = eventId,
                UserId = userId,
                RegisteredAt = DateTime.UtcNow,
                Attended = false
            };

            var createdRegistration = await _registrationRepository.CreateRegistrationAsync(registration);
            return ApiResponse<Registration>.SuccessResponse(createdRegistration);
        }

        public async Task<ApiResponse<bool>> CancelRegistrationAsync(string eventId, string userId)
        {
            // Check if event exists
            var eventEntity = await _eventRepository.GetEventByIdAsync(eventId);
            if (eventEntity == null)
            {
                return ApiResponse<bool>.FailureResponse("Event not found");
            }

            // Check if user exists
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<bool>.FailureResponse("User not found");
            }

            // Check if registration exists
            var registration = await _registrationRepository.GetRegistrationByEventAndUserIdAsync(eventId, userId);
            if (registration == null)
            {
                return ApiResponse<bool>.FailureResponse("Registration not found");
            }

            // Delete registration
            var result = await _registrationRepository.DeleteRegistrationByEventAndUserIdAsync(eventId, userId);
            if (!result)
            {
                return ApiResponse<bool>.FailureResponse("Failed to cancel registration");
            }

            return ApiResponse<bool>.SuccessResponse(true);
        }
    }
}
