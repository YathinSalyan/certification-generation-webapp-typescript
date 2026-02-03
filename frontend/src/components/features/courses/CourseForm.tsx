import React, { useState, useEffect } from 'react';
import { Input, TextArea } from '@components/ui';
import { Course, CreateCourseInput } from '@types/index';
import { DateUtils } from '@utils/dateUtils';

interface CourseFormProps {
  initialData?: Course | null;
  onSubmit: (data: CreateCourseInput) => void;
  submitButtonText?: string;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Create Course',
}) => {
  const [formData, setFormData] = useState<CreateCourseInput>({
    title: '',
    duration: '',
    startDate: '',
    endDate: '',
    description: '',
    certificateTemplate: {
      type: 'html',
      content: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        duration: initialData.duration,
        startDate: DateUtils.toInputFormat(initialData.startDate),
        endDate: DateUtils.toInputFormat(initialData.endDate),
        description: initialData.description || '',
        certificateTemplate: initialData.certificateTemplate || {
          type: 'html',
          content: '',
        },
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Course Title"
        value={formData.title}
        onChange={(v) => setFormData({ ...formData, title: v })}
        placeholder="e.g., Web Development Internship"
        required
      />

      <Input
        label="Duration"
        value={formData.duration}
        onChange={(v) => setFormData({ ...formData, duration: v })}
        placeholder="e.g., 4 weeks, 3 months"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(v) => setFormData({ ...formData, startDate: v })}
          required
        />

        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(v) => setFormData({ ...formData, endDate: v })}
          required
        />
      </div>

      <TextArea
        label="Description"
        value={formData.description || ''}
        onChange={(v) => setFormData({ ...formData, description: v })}
        placeholder="Brief description of the course (optional)"
        rows={3}
      />

      <TextArea
        label="Certificate Template (HTML)"
        value={formData.certificateTemplate.content}
        onChange={(v) =>
          setFormData({
            ...formData,
            certificateTemplate: { ...formData.certificateTemplate, content: v },
          })
        }
        placeholder="Enter HTML template. Use placeholders: {{studentName}}, {{courseTitle}}, {{completionDate}}, {{credentialId}}, {{validationUrl}}, {{qrCodeDataURL}}"
        rows={8}
        helperText="Available placeholders: {{studentName}}, {{courseTitle}}, {{completionDate}}, {{credentialId}}, {{validationUrl}}, {{qrCodeDataURL}}, {{collegeOrganization}}, {{startDate}}, {{endDate}}, {{courseDuration}}"
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        {submitButtonText}
      </button>
    </form>
  );
};