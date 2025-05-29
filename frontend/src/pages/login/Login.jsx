import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useLogin from '../../hooks/useLogin';
import { AuthForm } from '../../components/forms';
import { PATHS } from '../../constants';

const LogIn = () => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    hiddenPassword,
    setHiddenPassword,
    navigate,
  } = useLogin();

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
      label: 'Mật Khẩu',
      id: 'password',
      type: hiddenPassword ? 'password' : 'text',
      placeholder: 'password',
      ...register('password'),
      error: errors.password?.message,
      icon: (
        <FontAwesomeIcon
          onClick={() => setHiddenPassword(!hiddenPassword)}
          icon={hiddenPassword ? faEyeSlash : faEye}
          className="absolute bottom-4 right-4 hover:cursor-pointer"
        />
      ),
    },
  ];

  const formFooter = (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      Chưa có tài khoản?{' '}
      <Link to={PATHS.REGISTER} className="text-primaryColor">
        Đăng Ký
      </Link>
    </motion.p>
  );

  return (
    <motion.div
      className="mx-auto grid grid-cols-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="col-span-12 h-screen md:col-span-6 lg:col-span-5"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="mx-auto w-[90%]">
          <h1 className="py-4 text-center text-4xl font-bold text-primaryColor">
            Đăng Nhập
          </h1>
          <motion.div
            className="mb-9 h-[200px] w-full overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to={PATHS.HOME} className="flex items-center justify-center">
              <img
                className="h-full w-[200px] object-cover"
                src={require('../../assets/images/danahub.png')}
                alt="Logo"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <AuthForm
              title=""
              fields={formFields}
              onSubmit={handleSubmit(onSubmit)}
              submitText="Đăng Nhập"
              footer={formFooter}
              register={register}
            />
          </motion.div>
          <motion.div
            className="mt-5 text-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <p
              className="text-primaryColor hover:cursor-pointer"
              onClick={() => navigate(PATHS.FORGOT_PASSWORD)}
            >
              Quên mật khẩu!
            </p>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="hidden h-screen md:col-span-6 md:block lg:col-span-7 lg:block"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <img
          className="h-full w-full object-fit"
          src={require('../../assets/images/login-logo.jpg')}
          alt="ảnh smart city"
        />
      </motion.div>
    </motion.div>
  );
};

export default LogIn;
