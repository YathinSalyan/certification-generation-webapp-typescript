import React from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Card } from '@components/ui';
import { Course } from '@types/index';
import { DateUtils } from '@utils/dateUtils';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Duration: {course.duration}
            </p>
            <p>
              Period: {DateUtils.toReadableFormat(course.startDate)} -{' '}
              {DateUtils.toReadableFormat(course.endDate)}
            </p>
            {course.description && <p className="mt-2 text-gray-700">{course.description}</p>}
            <p className="mt-2 text-xs text-gray-500">
              Template: {course.certificateTemplate?.type || 'Not set'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(course)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit course"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(course.courseId)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Delete course"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </Card>
  );
};