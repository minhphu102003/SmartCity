import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthContext from "../../context/authProvider";
import MethodContext from "../../context/methodProvider";
import * as authServices from "../../services/auth";
import AuthForm from "../../components/forms/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LogIn = () => {
    const { setAuth, auth } = useContext(AuthContext);
    const { notify } = useContext(MethodContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.toastMessage) {
            notify(location.state.toastMessage, location.state.statusMessage);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginResponse = await authServices.login(email, password);
        if (loginResponse?.status === 200) {
            setAuth({ ...auth, roles: loginResponse.data.roles });
            localStorage.setItem("auth", JSON.stringify(auth));
            navigate("/", { state: { toastMessage: "Đăng nhập thành công!", statusMessage: "success" } });
        } else {
            notify("Đăng nhập thất bại!", "error");
        }
    };

    return (
        <div className="mx-auto grid grid-cols-12">
            <div className="h-screen col-span-12 md:col-span-6 lg:col-span-5">
                <div className="pb-12 w-[90%] mx-auto pl-5 pr-10">
                    <h1 className="pt-12 text-4xl text-primaryColor font-bold text-center">Đăng Nhập</h1>
                    <div className="w-full h-[200px] mb-9 overflow-hidden">
                        <Link to={"/"}>
                            <img className="w-[300px] h-full object-cover ml-12"
                                 src={require('../../assets/images/logo.png')} alt="Logo"/>
                        </Link>
                    </div>
                    <AuthForm
                        title=""
                        fields={[
                            { label: "Email", id: "email", type: "email", placeholder: "email@gmail.com", value: email, onChange: (e) => setEmail(e.target.value), required: true },
                            { label: "Mật Khẩu", id: "password", type: hiddenPassword ? "password" : "text", placeholder: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true,
                                icon: (
                                    <FontAwesomeIcon 
                                        onClick={() => setHiddenPassword(!hiddenPassword)}
                                        icon={hiddenPassword ? faEyeSlash : faEye}
                                        className="absolute bottom-4 right-4 hover:cursor-pointer"
                                    />
                                )
                            }
                        ]}
                        onSubmit={handleLogin}
                        submitText="Đăng Nhập"
                        footer={<p>Chưa có tài khoản? <Link to="/register" className="text-primaryColor">Đăng Ký</Link></p>}
                    />
                    <div className="mt-5 text-center">
                        <p className="text-primaryColor hover:cursor-pointer" onClick={() => navigate("/forgot-password")}>Quên mật khẩu!</p>
                    </div>
                </div>
            </div>
            <div className="h-screen hidden md:block lg:block md:col-span-6 lg:col-span-7">
                <img
                    className="w-full h-full object-cover"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA2cxDsQBnpXracds8wRvY_hY52kRjVkGHrg&s"
                    alt="ảnh smart city"
                />
            </div>
        </div>
    );
};

export default LogIn;