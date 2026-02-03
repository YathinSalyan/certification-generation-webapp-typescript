import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '@components/ui';
import { Student } from '@types/index';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            {student.classYear && <p>Class/Year: {student.classYear}</p>}
            {student.streamMajor && <p>Stream/Major: {student.streamMajor}</p>}
            <p>Organization: {student.collegeOrganization}</p>
            {student.email && <p>Email: {student.email}</p>}
            {student.mobileNo && <p>Mobile: {student.mobileNo}</p>}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(student)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit student"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(student.studentId)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Delete student"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </Card>
  );
};