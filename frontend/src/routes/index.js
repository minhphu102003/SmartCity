import { LayoutAuth } from '../layouts/index'
import {Home, LogIn, Register} from '../pages/index'

const router = [
    {path: '/', component: Home},
    {path: '/login', layout:LayoutAuth, component: LogIn},
    {path: '/register', layout:LayoutAuth, component: Register},
]
export {router}


