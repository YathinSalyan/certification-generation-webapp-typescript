export interface Student {
  studentId: string;
  fullName: string;
  classYear?: string | null;
  streamMajor?: string | null;
  collegeOrganization: string;
  email?: string | null;
  mobileNo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  fullName: string;
  classYear?: string;
  streamMajor?: string;
  collegeOrganization: string;
  email?: string;
  mobileNo?: string;
}

export interface UpdateStudentInput {
  fullName?: string;
  classYear?: string;
  streamMajor?: string;
  collegeOrganization?: string;
  email?: string;
  mobileNo?: string;
}