import { LayoutAuth, LayoutAdmin } from '../layouts/index';
import { Home, LogIn, Register, Camera, Admin, CustomMap, Report, ManagePlace, ManageReport, ManageCamera } from '../pages/index';
import { PATHS } from '../constants';
import MyProfile from '../pages/myPage/MyProfile';

const router = [
    { path: PATHS.HOME, component: Home },
    { path: PATHS.LOGIN, layout: LayoutAuth, component: LogIn },
    { path: PATHS.REGISTER, layout: LayoutAuth, component: Register },
    { path: PATHS.PROFILE, component: MyProfile },
    { path: PATHS.CAMERA, component: Camera },
    { path: PATHS.REPORT, component: Report },
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
      requireAdmin: true,
    },
    {
      path: PATHS.MANAGE_PLACES,
      layout: LayoutAdmin,
      component: ManagePlace,
      requireAdmin: true,
    },
    {
      path: PATHS.MANAGE_REPORTS,
      layout: LayoutAdmin,
      component: ManageReport,
      requireAdmin: true,
    },
    {
      path: PATHS.CREATE_CAMERA,
      layout: LayoutAdmin,
      component: ManageCamera,
      requireAdmin: true,
    }
  ];

export { router };