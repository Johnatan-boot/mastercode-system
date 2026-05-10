export type UserRole = 'student' | 'admin' | 'mentor';
export type SubscriptionStatus = 'none' | 'basic' | 'premium' | 'lifetime';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  subscription: SubscriptionStatus;
  status: UserStatus;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  totalLessons: number;
  duration: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  content: string;
  duration: string;
  order: number;
}

export interface UserProgress {
  userId: number;
  lessonId: string;
  completedAt: string;
}

export interface Post {
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: number;
  userName: string;
  content: string;
  timestamp: string;
}

export interface Certificate {
  id: string;
  userId: number;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  code: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  userId: number;
  items: any[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}
