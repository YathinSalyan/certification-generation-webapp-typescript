import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Calendar, User, BookOpen, Building } from 'lucide-react';
import { Card, Loader, Alert } from '@components/ui';
import { apiService } from '@api/apiService';
import { Mapping } from '@types/index';
import { DateUtils } from '@utils/dateUtils';
import { APP_NAME } from '@utils/constants';

export const ValidationPage: React.FC = () => {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const validateCredential = async () => {
      if (!credentialId) {
        setError('Invalid credential ID');
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.validateCredential(credentialId);
        setMapping(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Certificate validation failed');
      } finally {
        setLoading(false);
      }
    };

    validateCredential();
  }, [credentialId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Loader size="xl" text="Validating certificate..." />
      </div>
    );
  }

  if (error || !mapping) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <XCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Certificate</h1>
          <p className="text-gray-600 mb-4">
            {error || 'The certificate you are trying to validate could not be found.'}
          </p>
          <p className="text-sm text-gray-500">
            Credential ID: <span className="font-mono">{credentialId}</span>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="w-20 h-20 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="text-gray-600 mt-2">Certificate Validation</p>
        </div>

        {/* Validation Status */}
        <Card className="text-center border-2 border-green-500" padding="lg">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Certificate Valid</h2>
          <p className="text-gray-600">
            This certificate has been verified and is authentic.
          </p>
        </Card>

        {/* Certificate Details */}
        <Card padding="lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Certificate Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mapping.student?.fullName || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Organization</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mapping.student?.collegeOrganization || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mapping.course?.title || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Completion Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {DateUtils.toFullFormat(mapping.completionDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {DateUtils.toFullFormat(mapping.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Credential Information */}
        <Card padding="lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Credential Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Credential ID</p>
            <p className="font-mono text-sm text-gray-900 break-all">{mapping.credentialId}</p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            This certificate was issued by {APP_NAME} and can be verified at any time using the
            credential ID above.
          </p>
        </div>
      </div>
    </div>
  );
};