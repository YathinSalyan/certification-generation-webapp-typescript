import React from 'react';
import { Download, Eye, Trash2, ExternalLink } from 'lucide-react';
import { Card } from '@components/ui';
import { Mapping } from '@types/index';
import { DateUtils } from '@utils/dateUtils';

interface CertificateCardProps {
  mapping: Mapping;
  onPreview: (mappingId: string) => void;
  onDownload: (mappingId: string, credentialId: string) => void;
  onDelete: (mappingId: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  mapping,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const validationUrl = `${window.location.origin}/validate/${mapping.credentialId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(validationUrl);
    alert('Validation URL copied to clipboard!');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Credential ID: {mapping.credentialId}
            </h3>
          </div>

          <div className="text-sm text-gray-600 mt-3 space-y-2">
            <p>
              <span className="font-medium">Student:</span>{' '}
              {mapping.student?.fullName || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Course:</span> {mapping.course?.title || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Completion Date:</span>{' '}
              {DateUtils.toReadableFormat(mapping.completionDate)}
            </p>
            <p>
              <span className="font-medium">Issued:</span>{' '}
              {DateUtils.toReadableFormat(mapping.createdAt)}
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-900 mb-1">Validation URL</p>
                <p className="text-sm text-blue-700 truncate">{validationUrl}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-2 hover:bg-blue-100 rounded transition-colors"
                title="Copy URL"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2">
          <button
            onClick={() => onPreview(mapping.mappingId)}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            title="Preview certificate"
          >
            <Eye className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={() => onDownload(mapping.mappingId, mapping.credentialId)}
            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-5 h-5 text-green-600" />
          </button>
          <button
            onClick={() => onDelete(mapping.mappingId)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete mapping"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </Card>
  );
};