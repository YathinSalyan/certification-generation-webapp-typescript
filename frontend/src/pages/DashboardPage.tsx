import React, { useState } from 'react';
import { Users, BookOpen, Award } from 'lucide-react';
import { DashboardLayout } from '@components/layout';
import { StudentList } from '@components/features/students';
import { CourseList } from '@components/features/courses';
import { CertificateList } from '@components/features/certificates';

type TabType = 'students' | 'courses' | 'certificates';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('students');

  const tabs = [
    { id: 'students' as TabType, label: 'Students', icon: Users },
    { id: 'courses' as TabType, label: 'Courses', icon: BookOpen },
    { id: 'certificates' as TabType, label: 'Certificates', icon: Award },
  ];

  return (
    <DashboardLayout>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'students' && <StudentList />}
        {activeTab === 'courses' && <CourseList />}
        {activeTab === 'certificates' && <CertificateList />}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;