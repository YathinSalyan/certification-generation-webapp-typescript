import { Student } from './student.types';
import { Course } from './course.types';

export interface Mapping {
  mappingId: string;
  studentId: string;
  courseId: string;
  credentialId: string;
  completionDate: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  course?: Course;
}

export interface CreateMappingInput {
  studentId: string;
  courseId: string;
  completionDate: string;
}

export interface ValidationResult {
  isValid: boolean;
  mapping?: Mapping;
  message?: string;
}