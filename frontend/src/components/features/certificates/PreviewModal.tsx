import React from 'react';
import { Modal } from '@components/ui';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, htmlContent }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Certificate Preview" size="xl">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="w-full"
          style={{ minHeight: '400px' }}
        />
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900">
          <strong>Preview Notice:</strong> This is a preview of the certificate. The actual PDF
          may have slight differences in formatting. Use the download button to get the final
          PDF version.
        </p>
      </div>
    </Modal>
  );
};