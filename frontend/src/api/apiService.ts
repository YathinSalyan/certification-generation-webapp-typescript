import { API_URL, API_ENDPOINTS, DEFAULT_PAGINATION } from '@utils/constants';
import { StorageUtils } from '@utils/storageUtils';
import {
  ApiResponse,
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  Course,
  CreateCourseInput,
  UpdateCourseInput,
  Mapping,
  CreateMappingInput,
  LoginResponse,
  AdminProfile,
  PaginationParams,
} from '../types/index';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Get headers with authorization token
   */
  private getHeaders(): HeadersInit {
    const token = StorageUtils.getAdminToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // ============================================================================
  // ADMIN AUTH ENDPOINTS
  // ============================================================================

  /**
   * Admin login
   */
  async adminLogin(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_ENDPOINTS.ADMIN_LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  /**
   * Get admin profile
   */
  async getAdminProfile(): Promise<ApiResponse<AdminProfile>> {
    return this.request<AdminProfile>(API_ENDPOINTS.ADMIN_PROFILE);
  }

  // ============================================================================
  // STUDENTS ENDPOINTS
  // ============================================================================

  /**
   * Get all students with pagination
   */
  async getStudents(params?: PaginationParams): Promise<ApiResponse<{ students: Student[] }>> {
    const queryParams = new URLSearchParams({
      pageNumber: String(params?.pageNumber || DEFAULT_PAGINATION.pageNumber),
      recLimit: String(params?.recLimit || DEFAULT_PAGINATION.recLimit),
      ...(params?.search && { search: params.search }),
    });

    return this.request<{ students: Student[] }>(`${API_ENDPOINTS.STUDENTS}?${queryParams}`);
  }

  /**
   * Get single student by ID
   */
  async getStudent(studentId: string): Promise<ApiResponse<Student>> {
    return this.request<Student>(API_ENDPOINTS.STUDENT_BY_ID(studentId));
  }

  /**
   * Create new student
   */
  async createStudent(data: CreateStudentInput): Promise<ApiResponse<Student>> {
    return this.request<Student>(API_ENDPOINTS.STUDENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update student
   */
  async updateStudent(
    studentId: string,
    data: UpdateStudentInput
  ): Promise<ApiResponse<Student>> {
    return this.request<Student>(API_ENDPOINTS.STUDENT_BY_ID(studentId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete student
   */
  async deleteStudent(studentId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(API_ENDPOINTS.STUDENT_BY_ID(studentId), {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // COURSES ENDPOINTS
  // ============================================================================

  /**
   * Get all courses with pagination
   */
  async getCourses(params?: PaginationParams): Promise<ApiResponse<{ courses: Course[] }>> {
    const queryParams = new URLSearchParams({
      pageNumber: String(params?.pageNumber || DEFAULT_PAGINATION.pageNumber),
      recLimit: String(params?.recLimit || DEFAULT_PAGINATION.recLimit),
    });

    return this.request<{ courses: Course[] }>(`${API_ENDPOINTS.COURSES}?${queryParams}`);
  }

  /**
   * Get single course by ID
   */
  async getCourse(courseId: string): Promise<ApiResponse<Course>> {
    return this.request<Course>(API_ENDPOINTS.COURSE_BY_ID(courseId));
  }

  /**
   * Create new course
   */
  async createCourse(data: CreateCourseInput): Promise<ApiResponse<Course>> {
    return this.request<Course>(API_ENDPOINTS.COURSES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update course
   */
  async updateCourse(courseId: string, data: UpdateCourseInput): Promise<ApiResponse<Course>> {
    return this.request<Course>(API_ENDPOINTS.COURSE_BY_ID(courseId), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(API_ENDPOINTS.COURSE_BY_ID(courseId), {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // MAPPINGS ENDPOINTS
  // ============================================================================

  /**
   * Get all mappings with pagination
   */
  async getMappings(params?: PaginationParams): Promise<ApiResponse<{ mappings: Mapping[] }>> {
    const queryParams = new URLSearchParams({
      pageNumber: String(params?.pageNumber || DEFAULT_PAGINATION.pageNumber),
      recLimit: String(params?.recLimit || DEFAULT_PAGINATION.recLimit),
    });

    return this.request<{ mappings: Mapping[] }>(`${API_ENDPOINTS.MAPPINGS}?${queryParams}`);
  }

  /**
   * Get single mapping by ID
   */
  async getMapping(mappingId: string): Promise<ApiResponse<Mapping>> {
    return this.request<Mapping>(API_ENDPOINTS.MAPPING_BY_ID(mappingId));
  }

  /**
   * Create new mapping (student-course)
   */
  async createMapping(data: CreateMappingInput): Promise<ApiResponse<Mapping>> {
    return this.request<Mapping>(API_ENDPOINTS.MAPPINGS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete mapping
   */
  async deleteMapping(mappingId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(API_ENDPOINTS.MAPPING_BY_ID(mappingId), {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // CERTIFICATES ENDPOINTS
  // ============================================================================

  /**
   * Preview certificate (returns HTML)
   */
  async previewCertificate(mappingId: string): Promise<string> {
    const token = StorageUtils.getAdminToken();
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.CERTIFICATE_PREVIEW(mappingId)}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to preview certificate');
    }

    return response.text();
  }

  /**
   * Download certificate (returns PDF blob)
   */
  async downloadCertificate(mappingId: string): Promise<Blob> {
    const token = StorageUtils.getAdminToken();
    const response = await fetch(
      `${this.baseURL}${API_ENDPOINTS.CERTIFICATE_DOWNLOAD(mappingId)}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }

    return response.blob();
  }

  // ============================================================================
  // VALIDATION ENDPOINTS (PUBLIC)
  // ============================================================================

  /**
   * Validate credential (public endpoint)
   */
  async validateCredential(credentialId: string): Promise<ApiResponse<Mapping>> {
    return this.request<Mapping>(API_ENDPOINTS.VALIDATE(credentialId));
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;