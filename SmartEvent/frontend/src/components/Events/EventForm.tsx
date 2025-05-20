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
            Event Title <span className="text-orange-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-orange-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        {/* Image URL */}
        <div className="md:col-span-2">
          <label htmlFor="imageUrl" className="form-label">
            Image URL <span className="text-orange-500">*</span>
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className={`form-input ${errors.imageUrl ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {errors.imageUrl && <p className="text-orange-500 text-sm mt-1">{errors.imageUrl}</p>}
          
          <div className="mt-4">
            <label className="form-label mb-2">Select an image:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
                'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
                'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
                'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg'
              ].map(url => (
                <div 
                  key={url} 
                  className={`relative cursor-pointer rounded-md overflow-hidden border-2 ${formData.imageUrl === url ? 'border-orange-500' : 'border-black'}`}
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: url }))}
                >
                  <img
                    src={url}
                    alt="Event image option"
                    className="h-24 w-full object-cover"
                  />
                  {formData.imageUrl === url && (
                    <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {formData.imageUrl && (
              <div className="mt-4">
                <img
                  src={formData.imageUrl}
                  alt="Event preview"
                  className="h-40 w-full object-cover rounded-md border border-black"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="form-label">
            Category <span className="text-orange-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`form-input ${errors.category ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.category}
            onChange={handleChange}
          >
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-orange-500 text-sm mt-1">{errors.category}</p>}
        </div>
        
        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="form-label">
            Capacity <span className="text-orange-500">*</span>
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            className={`form-input ${errors.capacity ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <p className="text-orange-500 text-sm mt-1">{errors.capacity}</p>}
        </div>
        
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="form-label">
            Start Date & Time <span className="text-orange-500">*</span>
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            className={`form-input ${errors.startDate ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <p className="text-orange-500 text-sm mt-1">{errors.startDate}</p>}
        </div>
        
        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="form-label">
            End Date & Time <span className="text-orange-500">*</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            className={`form-input ${errors.endDate ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <p className="text-orange-500 text-sm mt-1">{errors.endDate}</p>}
        </div>
        
        {/* Location */}
        <div className="md:col-span-2">
          <label htmlFor="location" className="form-label">
            Location <span className="text-orange-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className={`form-input ${errors.location ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <p className="text-orange-500 text-sm mt-1">{errors.location}</p>}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="form-label">
            Description <span className="text-orange-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`form-input ${errors.description ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black'}`}
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-orange-500 text-sm mt-1">{errors.description}</p>}
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