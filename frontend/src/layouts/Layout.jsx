import React from "react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";

const Layout = ({children})=>{
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout;

