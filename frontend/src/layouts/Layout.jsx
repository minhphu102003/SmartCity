import React from "react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import SideBar from "../components/sideBar/siderBar.jsx";

const Layout = ({children})=>{
    return (
        <>
            <Header />
            <SideBar/>
            {children}
            <Footer />
        </>
    )
}

export default Layout;

