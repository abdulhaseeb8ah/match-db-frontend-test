/**
 * TypeScript types for MatchDB Platform
 * These types match the NestJS backend API responses
 */

export enum UserRole {
  CONSULTANT = 'consultant',
  COMPANY = 'company',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum UserStatus {
  PENDING = 'pending',
  EMAIL_VERIFIED = 'email_verified',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  name?: string;
  companyName?: string;
  linkedinUrl?: string;
  website?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  profile?: Profile;
  consultant?: Consultant;
  company?: Company;
}

export interface Profile {
  id: string;
  userId: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  completionPercentage: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logoUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  location?: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: Date | string;
  updatedAt: Date | string;
  company?: Company;
}

export interface Application {
  id: string;
  jobId: string;
  consultantId: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  job?: Job;
}

export interface Consultant {
  id: string;
  consultantNumber: number;
  userId: string;
  firstName: string;
  lastName: string;
  handle?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
  cvPath?: string;
  profileImageUrl?: string;
  
  // Professional Info
  yearsExperience?: string;
  specialization?: string;
  certifications?: string[];
  certificateUrls?: string[];
  hourlyRate?: string;
  availability?: string;
  
  // Skills & Expertise
  skills?: string[];
  industries?: string[];
  bio?: string;
  portfolioUrls?: string[];
  
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
}

// Form validation schemas (simplified versions without Drizzle)
export interface ProfileFormData {
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  location?: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface ConsultantFormData {
  title?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  availability?: string;
  certifications?: string[];
  portfolioUrl?: string;
}

// API Response types
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
