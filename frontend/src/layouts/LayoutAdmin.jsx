import React, { useState } from "react";
import SidebarAdmin from "../components/sideBar/SideBarAdmin";
import { TopBar } from '../components/topBar';

const AdminLayout = ({ children }) => {
    const [isSidebar, setIsSidebar] = useState(true);
  
    return (
      <div className="flex h-screen">
        <SidebarAdmin isSidebar={isSidebar} />
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
  