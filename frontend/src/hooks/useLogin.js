import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/authProvider';
import MethodContext from '../context/methodProvider';
import * as authServices from '../services/auth';
import { PATHS } from '../constants';
import { loginSchema } from '../schemas/loginSchema';
import { ROLES } from '../constants';

const useLogin = () => {
  const { setAuth } = useContext(AuthContext);
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

    if (loginResponse?.status === 200) {
      const { roles, token } = loginResponse.data?.data;
      const authData = {
        roles: roles,
        token: token,
      };
  
      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
  
      if (roles.includes(ROLES.ADMIN)) {
        navigate(PATHS.ADMIN, {
          state: {
            toastMessage: 'Login successfully with Admin rights!',
            statusMessage: 'success',
          },
        });
      } else if (roles.includes(ROLES.USER)) {
        navigate(PATHS.HOME, {
          state: {
            toastMessage: 'Login successful!',
            statusMessage: 'success',
          },
        });
      }
    } else {
      setError("email", { type: "manual", message: "Email or password is incorrect!" });
      notify('Login failed!', 'error');
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
