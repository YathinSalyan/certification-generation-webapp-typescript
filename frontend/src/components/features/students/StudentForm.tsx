import React, { useState, useEffect } from 'react';
import { Input } from '@components/ui';
import { Student, CreateStudentInput } from '@/types/student.types';

interface StudentFormProps {
  initialData?: Student | null;
  onSubmit: (data: CreateStudentInput) => void;
  submitButtonText?: string;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText = 'Create Student',
}) => {
  const [formData, setFormData] = useState<CreateStudentInput>({
    fullName: '',
    classYear: '',
    streamMajor: '',
    collegeOrganization: '',
    email: '',
    mobileNo: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        classYear: initialData.classYear || '',
        streamMajor: initialData.streamMajor || '',
        collegeOrganization: initialData.collegeOrganization,
        email: initialData.email || '',
        mobileNo: initialData.mobileNo || '',
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
        label="Full Name"
        value={formData.fullName}
        onChange={(v) => setFormData({ ...formData, fullName: v })}
        placeholder="Enter full name"
        required
      />

      <Input
        label="Class/Year"
        value={formData.classYear || ''}
        onChange={(v) => setFormData({ ...formData, classYear: v })}
        placeholder="e.g., 3rd Year, Senior, etc."
      />

      <Input
        label="Stream/Major"
        value={formData.streamMajor || ''}
        onChange={(v) => setFormData({ ...formData, streamMajor: v })}
        placeholder="e.g., Computer Science, Engineering, etc."
      />

      <Input
        label="College/Organization"
        value={formData.collegeOrganization}
        onChange={(v) => setFormData({ ...formData, collegeOrganization: v })}
        placeholder="Enter college or organization name"
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={(v) => setFormData({ ...formData, email: v })}
        placeholder="student@example.com (optional)"
      />

      <Input
        label="Mobile Number"
        value={formData.mobileNo || ''}
        onChange={(v) => setFormData({ ...formData, mobileNo: v })}
        placeholder="Enter mobile number (optional)"
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