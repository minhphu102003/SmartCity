import React from "react";
import { SiderBar } from "../components/sideBar";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen relative">
            <SiderBar className="fixed top-0 left-0 z-50" />
            <main className="flex-1 ml-20">{children}</main>
        </div>
    );
};

export default Layout;
