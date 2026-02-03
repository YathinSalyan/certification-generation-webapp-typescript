export interface CertificateTemplate {
  type: 'html' | 'custom';
  content: string;
}

export interface Course {
  courseId: string;
  title: string;
  duration: string;
  startDate: string;
  endDate: string;
  certificateTemplate: CertificateTemplate;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  title: string;
  duration: string;
  startDate: string;
  endDate: string;
  certificateTemplate: CertificateTemplate;
  description?: string;
}

export interface UpdateCourseInput {
  title?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  certificateTemplate?: CertificateTemplate;
  description?: string;
}