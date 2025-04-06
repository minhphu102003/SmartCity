import { LayoutAuth, LayoutAdmin } from '../layouts/index';
import { Home, LogIn, Register, Camera, Admin, CustomMap } from '../pages/index';
import { PATHS } from '../constants';
import MyProfile from '../pages/myPage/MyProfile';

const router = [
    { path: PATHS.HOME, component: Home },
    { path: PATHS.LOGIN, layout: LayoutAuth, component: LogIn },
    { path: PATHS.REGISTER, layout: LayoutAuth, component: Register },
    { path: PATHS.PROFILE, component: MyProfile },
    { path: PATHS.CAMERA, component: Camera },
    {
      path: PATHS.ADMIN,
      layout: LayoutAdmin,
      component: Admin,
      requireAdmin: true
    },
    {
      path: PATHS.CREATE_NOTIFICATION,
      layout: LayoutAdmin,
      component: CustomMap,
      requireAdmin: true
    }
  ];

export { router };