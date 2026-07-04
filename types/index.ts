export type UserRole = 'student' | 'teacher';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  college?: string;
  year?: string;
  isInterviewer: boolean;
  domains: string[];
  rating: number;
  reviewCount: number;
  totalInterviews: number;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  interviewerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isBooked: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  interviewerId: string;
  interviewerName: string;
  interviewerAvatar?: string;
  slotId: string;
  meetLink: string;
  status: BookingStatus;
  domain: string;
  scheduledAt: string; // ISO string
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  role: 'student' | 'interviewer'; // who wrote this review
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'review_received' | 'general';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string;
  endTime: string;
}

export interface DashboardStats {
  totalInterviews: number;
  upcomingInterviews: number;
  averageRating: number;
  totalReviews: number;
}
