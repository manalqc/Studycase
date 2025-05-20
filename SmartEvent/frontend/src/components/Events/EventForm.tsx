import React, { useState } from 'react';
import Button from '../UI/Button';
import { Event } from '../../types';
import { addDays, addHours, format } from 'date-fns';

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  isSubmitting: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting,
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    location: '',
    startDate: format(tomorrow, "yyyy-MM-dd'T'HH:mm"),
    endDate: format(addHours(tomorrow, 2), "yyyy-MM-dd'T'HH:mm"),
    capacity: 50,
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
    category: 'Conference',
    ...initialData,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (
      formData.startDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    if (!formData.imageUrl?.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(formData);
    }
  };
  
  const categoryOptions = [
    'Conference',
    'Workshop',
    'Seminar',
    'Networking',
    'Webinar',
    'Social',
    'Other',
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="form-label">
            Event Title <span className="text-error-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>
        
        {/* Image URL */}
        <div className="md:col-span-2">
          <label htmlFor="imageUrl" className="form-label">
            Image URL <span className="text-error-500">*</span>
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className={`form-input ${errors.imageUrl ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {errors.imageUrl && <p className="form-error">{errors.imageUrl}</p>}
          
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Event preview"
                className="h-32 w-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="form-label">
            Category <span className="text-error-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`form-input ${errors.category ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.category}
            onChange={handleChange}
          >
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>
        
        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="form-label">
            Capacity <span className="text-error-500">*</span>
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            className={`form-input ${errors.capacity ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <p className="form-error">{errors.capacity}</p>}
        </div>
        
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="form-label">
            Start Date & Time <span className="text-error-500">*</span>
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            className={`form-input ${errors.startDate ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <p className="form-error">{errors.startDate}</p>}
        </div>
        
        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="form-label">
            End Date & Time <span className="text-error-500">*</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            className={`form-input ${errors.endDate ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <p className="form-error">{errors.endDate}</p>}
        </div>
        
        {/* Location */}
        <div className="md:col-span-2">
          <label htmlFor="location" className="form-label">
            Location <span className="text-error-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className={`form-input ${errors.location ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="form-label">
            Description <span className="text-error-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`form-input ${errors.description ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="form-error">{errors.description}</p>}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {initialData.id ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;