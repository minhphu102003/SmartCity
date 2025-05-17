import React, { useState } from 'react';
import { CameraReportList, UserReportList } from '../../components/reports';
import { ReportTabs } from '../../components/tabs';

const ReportManager = () => {
  const [activeTab, setActiveTab] = useState('camera');

  return (
    <div className="w-full p-5">
      <h2 className="text-2xl font-bold mb-4">Report Management</h2>

      <ReportTabs
        tabs={[
          { id: 'camera', label: 'Camera Report' },
          { id: 'user', label: 'User Report' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'camera' ? <CameraReportList /> : <UserReportList />}
      </div>
    </div>
  );
};

export default ReportManager;
