import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, Alert, Loader, Modal } from '@components/ui';
import { StudentCard } from './StudentCard';
import { StudentForm } from './StudentForm';
import { useStudents } from '@hooks/useStudents';
import { Student } from '@/types/student.types';

export const StudentList: React.FC = () => {
  const { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent } =
    useStudents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents({ search: searchTerm });
  }, [fetchStudents, searchTerm]);

  const handleCreate = async (data: any) => {
    try {
      await createStudent(data);
      setSuccess('Student created successfully!');
      setIsModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingStudent) return;
    try {
      await updateStudent(editingStudent.studentId, data);
      setSuccess('Student updated successfully!');
      setIsModalOpen(false);
      setEditingStudent(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(studentId);
      setSuccess('Student deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handled by hook
    }
  };

  const openCreateModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Loader size="lg" text="Loading students..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Students / Participants</h2>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Student Cards */}
      <div className="grid gap-4">
        {students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No students found. Add your first student to get started!</p>
          </div>
        ) : (
          students.map((student) => (
            <StudentCard
              key={student.studentId}
              student={student}
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
        title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          initialData={editingStudent}
          onSubmit={editingStudent ? handleUpdate : handleCreate}
          submitButtonText={editingStudent ? 'Update Student' : 'Create Student'}
        />
      </Modal>
    </div>
  );
};