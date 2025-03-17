import { LayoutAuth } from '../layouts/index';
import { Home, LogIn, Register } from '../pages/index';
import { PATHS } from '../constants';
import MyProfile from '../pages/myPage/MyProfile';

const router = [
    { path: PATHS.HOME, component: Home },
    { path: PATHS.LOGIN, layout: LayoutAuth, component: LogIn },
    { path: PATHS.REGISTER, layout: LayoutAuth, component: Register },
    { path: PATHS.PROFILE, component: MyProfile },
];

export { router };