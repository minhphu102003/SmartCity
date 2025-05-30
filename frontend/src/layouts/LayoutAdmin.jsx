import React, { useState } from "react";
import { SideBarAdmin } from "../components/SideBar";
import { TopBar } from '../components/topBar';

const AdminLayout = ({ children }) => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="flex h-screen">
      <SideBarAdmin isSidebar={isSidebar} />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
