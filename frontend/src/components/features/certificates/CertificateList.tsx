import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Alert, Loader, Modal } from '@components/ui';
import { CertificateCard } from './CertificateCard';
import { MappingForm } from './MappingForm';
import { PreviewModal } from './PreviewModal';
import { useCertificates } from '@hooks/useCertificates';
import { useStudents } from '@hooks/useStudents';
import { useCourses } from '@hooks/useCourses';

export const CertificateList: React.FC = () => {
  const {
    mappings,
    loading: mappingsLoading,
    error: mappingsError,
    fetchMappings,
    createMapping,
    deleteMapping,
    previewCertificate,
    downloadCertificate,
  } = useCertificates();

  const { students, fetchStudents } = useStudents();
  const { courses, fetchCourses } = useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMappings();
    fetchStudents();
    fetchCourses();
  }, [fetchMappings, fetchStudents, fetchCourses]);

  const handleCreate = async (data: any) => {
    try {
      await createMapping(data);
      setSuccess('Certificate mapping created successfully!');
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mapping');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handlePreview = async (mappingId: string) => {
    try {
      setError('');
      const html = await previewCertificate(mappingId);
      setPreviewHtml(html);
      setIsPreviewOpen(true);
    } catch (err) {
      setError('Failed to preview certificate');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDownload = async (mappingId: string, credentialId: string) => {
    try {
      setError('');
      await downloadCertificate(mappingId, credentialId);
      setSuccess('Certificate downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to download certificate');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (mappingId: string) => {
    if (!confirm('Are you sure you want to delete this mapping? This action cannot be undone.'))
      return;
    try {
      await deleteMapping(mappingId);
      setSuccess('Mapping deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete mapping');
      setTimeout(() => setError(''), 5000);
    }
  };

  if (mappingsLoading && mappings.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader size="lg" text="Loading certificates..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificate Mappings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create student-course mappings to generate certificates
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Create Mapping
        </Button>
      </div>

      {/* Alerts */}
      {(mappingsError || error) && (
        <Alert type="error" message={mappingsError || error} onClose={() => setError('')} />
      )}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Certificate Cards */}
      <div className="grid gap-4">
        {mappings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No certificate mappings found. Create your first mapping to get started!</p>
          </div>
        ) : (
          mappings.map((mapping) => (
            <CertificateCard
              key={mapping.mappingId}
              mapping={mapping}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Create Mapping Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Certificate Mapping"
      >
        <MappingForm
          students={students}
          courses={courses}
          onSubmit={handleCreate}
          submitButtonText="Create Mapping"
        />
      </Modal>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        htmlContent={previewHtml}
      />
    </div>
  );
};