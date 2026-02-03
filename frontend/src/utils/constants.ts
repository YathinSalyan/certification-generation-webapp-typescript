export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Certificate Management System';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'adminToken',
  THEME: 'theme',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  VALIDATION: '/validate/:credentialId',
} as const;

export const API_ENDPOINTS = {
  // Admin Auth
  ADMIN_LOGIN: '/v1/admin/auth/login',
  ADMIN_PROFILE: '/v1/admin/auth/me',
  
  // Students
  STUDENTS: '/v1/students',
  STUDENT_BY_ID: (id: string) => `/v1/students/${id}`,
  
  // Courses
  COURSES: '/v1/courses',
  COURSE_BY_ID: (id: string) => `/v1/courses/${id}`,
  
  // Mappings
  MAPPINGS: '/v1/mappings',
  MAPPING_BY_ID: (id: string) => `/v1/mappings/${id}`,
  
  // Certificates
  CERTIFICATE_PREVIEW: (id: string) => `/v1/certificates/preview/${id}`,
  CERTIFICATE_DOWNLOAD: (id: string) => `/v1/certificates/download/${id}`,
  
  // Validation
  VALIDATE: (credentialId: string) => `/v1/validate/${credentialId}`,
} as const;

export const DEFAULT_PAGINATION = {
  pageNumber: 1,
  recLimit: 50,
} as const;