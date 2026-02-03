import { useState, useCallback } from 'react';

import { apiService } from '@api/apiService';
import { Course, UpdateCourseInput } from '@/types/course.types';
import { PaginationParams } from '@/types';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: (params?: PaginationParams) => Promise<void>;
  createCourse: (data: Partial<Course>) => Promise<void>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getCourses(params);
      setCourses(response.data.courses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (data: Partial<Course>) => {
    setError(null);
    try {
      await apiService.createCourse(data as any);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      throw err;
    }
  }, [fetchCourses]);

  const updateCourse = useCallback(async (id: string, data:UpdateCourseInput) => {
    setError(null);
    try {
      await apiService.updateCourse(id, data);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      throw err;
    }
  }, [fetchCourses]);

  const deleteCourse = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiService.deleteCourse(id);
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      throw err;
    }
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};