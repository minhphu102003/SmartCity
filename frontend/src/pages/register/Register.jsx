import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import MethodContext from "../../context/methodProvider";
import * as authService from "../../services/auth";
import { AuthForm } from "../../components/forms";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const { notify } = useContext(MethodContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== rePassword) {
            notify("Mật khẩu không trùng khớp!", "error");
            return;
        }
        const registerResponse = await authService.register(name, email, password);
        if (registerResponse?.status === 200) {
            navigate("/verify-email", { state: { toastMessage: "Vui lòng nhập mã OTP!", statusMessage: "success" } });
        } else {
            notify("Đăng ký thất bại!", "error");
        }
    };

    return (
        <AuthForm
            title="Đăng Ký"
            fields={[
                { label: "Email", id: "email", type: "email", placeholder: "email@gmail.com", value: email, onChange: (e) => setEmail(e.target.value), required: true },
                { label: "Họ và Tên", id: "name", type: "text", placeholder: "Họ và tên", value: name, onChange: (e) => setName(e.target.value), required: true },
                { label: "Mật Khẩu", id: "password", type: "password", placeholder: "Mật khẩu", value: password, onChange: (e) => setPassword(e.target.value), required: true },
                { label: "Nhập Lại Mật Khẩu", id: "rePassword", type: "password", placeholder: "Nhập lại mật khẩu", value: rePassword, onChange: (e) => setRePassword(e.target.value), required: true },
            ]}
            onSubmit={handleRegister}
            submitText="Đăng Ký"
            footer={<p>Đã có tài khoản? <Link to="/login" className="text-primaryColor">Đăng Nhập</Link></p>}
        />
    );
};

export default RegisterForm;
