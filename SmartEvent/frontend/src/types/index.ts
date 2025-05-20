export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  imageUrl: string;
  category: string;
  createdBy: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}