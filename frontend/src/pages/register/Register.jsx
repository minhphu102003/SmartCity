import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthForm } from '../../components/forms';
import useRegister from '../../hooks/useRegister';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { PATHS } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {

    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (location.state?.toastMessage) {
        toast(location.state.toastMessage, {
          type: location.state.statusMessage === 'success' ? 'success' : 'error',
        });
  
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location, navigate]);

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    hiddenPassword,
    setHiddenPassword,
  } = useRegister();

  const formFields = [
    {
      label: 'Email',
      id: 'email',
      type: 'email',
      placeholder: 'email@gmail.com',
      ...register('email'),
      error: errors.email?.message,
    },
    {
      label: 'Họ và Tên',
      id: 'name',
      type: 'text',
      placeholder: 'Họ và tên',
      ...register('name'),
      error: errors.name?.message,
    },
    {
      label: 'Mật Khẩu',
      id: 'password',
      type: hiddenPassword ? 'password' : 'text',
      placeholder: 'Mật khẩu',
      ...register('password'),
      error: errors.password?.message,
      icon: (
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <FontAwesomeIcon
            onClick={() => setHiddenPassword(!hiddenPassword)}
            icon={hiddenPassword ? faEyeSlash : faEye}
            className="absolute bottom-4 right-4 hover:cursor-pointer"
          />
        </motion.div>
      ),
    },
    {
      label: 'Nhập Lại Mật Khẩu',
      id: 'rePassword',
      type: hiddenPassword ? 'password' : 'text',
      placeholder: 'Nhập lại mật khẩu',
      ...register('rePassword'),
      error: errors.rePassword?.message,
    },
  ];

  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="flex w-[50%] items-center justify-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <AuthForm
          title="Đăng Ký"
          fields={formFields}
          onSubmit={handleSubmit(onSubmit)}
          submitText="Đăng Ký"
          register={register}
          footer={
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Đã có tài khoản?{' '}
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={PATHS.LOGIN} className="text-primaryColor">
                  Đăng Nhập
                </Link>
              </motion.span>
            </motion.p>
          }
        />
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
