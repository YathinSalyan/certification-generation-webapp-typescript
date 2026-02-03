import React, { useState } from 'react';
import { Input, Select } from '@components/ui';
import { Student, Course, CreateMappingInput } from '@types/index';
import { DateUtils } from '@utils/dateUtils';

interface MappingFormProps {
  students: Student[];
  courses: Course[];
  onSubmit: (data: CreateMappingInput) => void;
  submitButtonText?: string;
}

export const MappingForm: React.FC<MappingFormProps> = ({
  students,
  courses,
  onSubmit,
  submitButtonText = 'Create Mapping',
}) => {
  const [formData, setFormData] = useState<CreateMappingInput>({
    studentId: '',
    courseId: '',
    completionDate: DateUtils.getCurrentDate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const studentOptions = students.map((student) => ({
    value: student.studentId,
    label: student.fullName,
  }));

  const courseOptions = courses.map((course) => ({
    value: course.courseId,
    label: course.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Select Student"
        value={formData.studentId}
        onChange={(v) => setFormData({ ...formData, studentId: v })}
        options={studentOptions}
        placeholder="Choose a student..."
        required
      />

      <Select
        label="Select Course"
        value={formData.courseId}
        onChange={(v) => setFormData({ ...formData, courseId: v })}
        options={courseOptions}
        placeholder="Choose a course..."
        required
      />

      <Input
        label="Completion Date"
        type="date"
        value={formData.completionDate}
        onChange={(v) => setFormData({ ...formData, completionDate: v })}
        required
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Creating this mapping will generate a unique credential ID and
          enable certificate generation for this student-course combination.
        </p>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        {submitButtonText}
      </button>
    </form>
  );
};