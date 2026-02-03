import { useState, useCallback } from 'react';

import { apiService } from '@api/apiService';
import { Student, UpdateStudentInput } from '@/types/student.types';
import { PaginationParams } from '@/types/api.types';

interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: (params?: PaginationParams) => Promise<void>;
  createStudent: (data: Partial<Student>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export const useStudents = (): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getStudents(params);
      console.log('Fetched students:', response.data);
      setStudents(response.data.students);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (data: Partial<Student>) => {
    setError(null);
    try {
      await apiService.createStudent(data as any);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student');
      throw err;
    }
  }, [fetchStudents]);

  const updateStudent = useCallback(async (id: string, data:UpdateStudentInput) => {
    setError(null);
    try {
      await apiService.updateStudent(id, data);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student');
      throw err;
    }
  }, [fetchStudents]);

  const deleteStudent = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiService.deleteStudent(id);
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student');
      throw err;
    }
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};