import React from "react";
import {SideBar} from "../components/SideBar";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen relative">
            <SideBar className="fixed top-0 left-0 z-50" />
            <main className="flex-1 ml-20">{children}</main>
        </div>
    );
};

export default Layout;