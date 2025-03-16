import { LayoutAuth } from '../layouts/index';
import { Home, LogIn, Register } from '../pages/index';
import { PATHS } from '../constants';

const router = [
    { path: PATHS.HOME, component: Home },
    { path: PATHS.LOGIN, layout: LayoutAuth, component: LogIn },
    { path: PATHS.REGISTER, layout: LayoutAuth, component: Register },
];

export { router };