import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { registerSchema } from '../schemas/registerSchema';
import AuthContext from '../context/authProvider';
import MethodContext from '../context/methodProvider';
import * as authServices from '../services/auth';
import { PATHS } from '../constants';

const useRegister = () => {
  const { setAuth } = useContext(AuthContext);
  const { notify } = useContext(MethodContext);
  const navigate = useNavigate();
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      rePassword: '',
    },
  });

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    const registerResponse = await authServices.register(name, email, password);
    console.log(registerResponse);
    if (registerResponse?.status === 201) {
      navigate(PATHS.LOGIN, {
        state: {
          toastMessage: 'Đăng kí thành công',
          statusMessage: 'success',
        },
      });
    } else {
    //   notify('Đăng ký thất bại!', 'error');
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    hiddenPassword,
    setHiddenPassword,
  };
};

export default useRegister;
