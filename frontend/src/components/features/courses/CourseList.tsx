import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Alert, Loader, Modal } from '@components/ui';
import { CourseCard } from './CourseCard';
import { CourseForm } from './CourseForm';
import { useCourses } from '@hooks/useCourses';
import { Course } from '@types/index';

export const CourseList: React.FC = () => {
  const { courses, loading, error, fetchCourses, createCourse, updateCourse, deleteCourse } =
    useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreate = async (data: any) => {
    try {
      await createCourse(data);
      setSuccess('Course created successfully!');
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingCourse) return;
    try {
      await updateCourse(editingCourse.courseId, data);
      setSuccess('Course updated successfully!');
      setIsModalOpen(false);
      setEditingCourse(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(courseId);
      setSuccess('Course deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Courses / Programs</h2>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Add Course
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Course Cards */}
      <div className="grid gap-4">
        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No courses found. Add your first course to get started!</p>
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        size="lg"
      >
        <CourseForm
          initialData={editingCourse}
          onSubmit={editingCourse ? handleUpdate : handleCreate}
          submitButtonText={editingCourse ? 'Update Course' : 'Create Course'}
        />
      </Modal>
    </div>
  );
};