import React from "react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import SideBar from "../components/sideBar/siderBar.jsx";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen relative">
            <Header className="fixed w-full top-0 left-0 z-40" />
            <SideBar className="fixed top-0 left-0 z-50" />
            <div className="flex flex-1 pt-16">
                <main className="flex-1 overflow-auto ml-20">
                    {children}
                </main>
            </div>
            <Footer className="fixed bottom-0 left-0 w-full z-30" />
        </div>
    );
};

export default Layout;