import {getSession} from '../store/session.js'
import {authGuard, roleGuard} from '../middleware/guards.js'
import { renderLogin } from '../views/login/login.js'
import { renderRegister } from '../views/register/register.js'
import { renderDashboard } from '../views/dashboard/dashboard.js'
import { renderDenied } from '../views/denied/denied.js'

const routes = {
    '#/login': {view: renderLogin, roles: null},
    '#/register': {view: renderRegister, roles: null},
    '#/dashboard': {view: renderDashboard, roles: ['admin', 'tech', 'client']}
}

export function router(){
    const hash = window.location.hash  || '#/login'

    const route = routes[hash]

    if (!route){
        window.location.hash = '#/login'
        return
    }

    if (!authGuard(hash)) return

    if(route.roles && !roleGuard(route.roles)){
        renderDenied()
        return
    }

    route.view()

}