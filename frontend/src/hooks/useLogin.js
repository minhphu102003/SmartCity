import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/authProvider';
import MethodContext from '../context/methodProvider';
import * as authServices from '../services/auth';
import { PATHS } from '../constants';
import { loginSchema } from '../schemas/loginSchema';

const useLogin = () => {
  const { setAuth, auth } = useContext(AuthContext);
  const { notify } = useContext(MethodContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (location.state?.toastMessage) {
      notify(location.state.toastMessage, location.state.statusMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, notify, navigate]);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const loginResponse = await authServices.login(email, password);
    console.log(loginResponse);

    if (loginResponse?.status === 200) {
      setAuth({ ...auth, roles: loginResponse.data?.data?.roles });
      localStorage.setItem('auth', JSON.stringify(auth));
      navigate(PATHS.HOME, {
        state: {
          toastMessage: 'Đăng nhập thành công!',
          statusMessage: 'success',
        },
      });
    } else {
      setError("email", { type: "manual", message: "Email hoặc mật khẩu không đúng!" });
      notify('Đăng nhập thất bại!', 'error');
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    hiddenPassword,
    setHiddenPassword,
    navigate,
  };
};

export default useLogin;
