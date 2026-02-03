import { useState, useCallback } from 'react';
import { Mapping, PaginationParams } from '@types/index';
import { apiService } from '@api/apiService';

interface UseCertificatesReturn {
  mappings: Mapping[];
  loading: boolean;
  error: string | null;
  fetchMappings: (params?: PaginationParams) => Promise<void>;
  createMapping: (data: { studentId: string; courseId: string; completionDate: string }) => Promise<void>;
  deleteMapping: (id: string) => Promise<void>;
  previewCertificate: (mappingId: string) => Promise<string>;
  downloadCertificate: (mappingId: string, credentialId: string) => Promise<void>;
}

export const useCertificates = (): UseCertificatesReturn => {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMappings = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getMappings(params);
      setMappings(response.data.mappings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMapping = useCallback(async (data: { studentId: string; courseId: string; completionDate: string }) => {
    setError(null);
    try {
      await apiService.createMapping(data);
      await fetchMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mapping');
      throw err;
    }
  }, [fetchMappings]);

  const deleteMapping = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiService.deleteMapping(id);
      await fetchMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mapping');
      throw err;
    }
  }, [fetchMappings]);

  const previewCertificate = useCallback(async (mappingId: string): Promise<string> => {
    setError(null);
    try {
      return await apiService.previewCertificate(mappingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview certificate');
      throw err;
    }
  }, []);

  const downloadCertificate = useCallback(async (mappingId: string, credentialId: string) => {
    setError(null);
    try {
      const blob = await apiService.downloadCertificate(mappingId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${credentialId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download certificate');
      throw err;
    }
  }, []);

  return {
    mappings,
    loading,
    error,
    fetchMappings,
    createMapping,
    deleteMapping,
    previewCertificate,
    downloadCertificate,
  };
};