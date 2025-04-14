import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const REPORT_REASONS = [
  { id: 'SPAM', label: 'Spam or advertising' },
  { id: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { id: 'FALSE_INFO', label: 'False information' },
  { id: 'DUPLICATE', label: 'Duplicate content' },
  { id: 'OTHER', label: 'Other reason' },
];

const ReportModal = ({ isOpen, onClose, onSubmit, reportedContent }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      setError('Please select a reason for reporting');
      return;
    }

    if (selectedReason === 'OTHER' && !customReason.trim()) {
      setError('Please enter your reason for reporting');
      return;
    }

    onSubmit({
      reportId: reportedContent?.id,
      reason: selectedReason,
      description: selectedReason === 'OTHER' ? customReason : '',
      reportedContent
    });

    // Reset form
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] max-w-[95%]"
          >
            <div className="bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9V14M12 17.5V18M6.6 21H17.4C18.8359 21 19.5544 21 20.0927 20.7478C20.5645 20.5245 20.9441 20.1673 21.1903 19.7145C21.4679 19.1953 21.4679 18.5022 21.4679 17.116V16.9771C21.4679 15.5031 21.4679 14.7661 21.1787 14.1547C20.9268 13.6163 20.5297 13.1557 20.0312 12.8092C19.4602 12.4135 18.7076 12.2197 17.2024 11.832L13.4679 10.8885C12.8431 10.7275 12.5307 10.647 12.2113 10.6261C11.9209 10.6072 11.6286 10.6297 11.3457 10.6929C11.0309 10.7629 10.7305 10.8897 10.1296 11.1432L6.75275 12.6022C5.35203 13.17 4.65167 13.4538 4.11168 13.9491C3.63659 14.3851 3.27737 14.9246 3.06446 15.5268C2.82492 16.2093 2.82492 16.9973 2.82492 18.5732V17.116C2.82492 18.5022 2.82492 19.1953 3.10246 19.7145C3.34863 20.1673 3.72828 20.5245 4.20008 20.7478C4.73836 21 5.45685 21 6.89384 21H6.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2C13.5 2 14.8333 2.33333 15.5 2.5C15.5 4 15.7 5.5 16.5 7C17.3 8.5 18.6667 9.33333 19.5 9.5C19 11.5 17 12 16.5 12C16 12 15 11.5 14.5 11C13.8333 10.3333 13 8.5 12 8.5C11 8.5 10.1667 10.3333 9.5 11C9 11.5 8 12 7.5 12C7 12 5 11.5 4.5 9.5C5.33333 9.33333 6.7 8.5 7.5 7C8.3 5.5 8.5 4 8.5 2.5C9.16667 2.33333 10.5 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3 className="text-base font-medium text-gray-900">
                    Report Post
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Please select a reason for reporting this post:
                </p>

                {/* Report reasons */}
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason.id}
                      className="flex items-center py-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => {
                          setSelectedReason(e.target.value);
                          setError('');
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                        {reason.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Custom reason input */}
                {selectedReason === 'OTHER' && (
                  <div className="mt-3">
                    <textarea
                      value={customReason}
                      onChange={(e) => {
                        setCustomReason(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter your reason for reporting..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                )}

                {/* Show reported content summary */}
                {reportedContent && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Reporting post:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{reportedContent.content}</p>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <p className="mt-2 text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Report
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReportModal; 