import { LayoutAuth } from '../layouts/index'
import {Home, LogIn} from '../pages/index'

const router = [
    {path: '/', component: Home},
    {path: '/login', layout:LayoutAuth, component: LogIn},
]
export {router}


