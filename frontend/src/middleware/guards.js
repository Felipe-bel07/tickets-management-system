import { getSession } from '../store/session.js'

export function authGuard(hash){
    const session = getSession()
    const publicRoutes = ['#/login', '#/register']

    if (publicRoutes.includes(hash)){
        if(session){
            window.location.hash = '#/dashboard'
            return false
        }
        return true
    }

    if(!session){
        window.location.hash = '#/login'
        return false
    }
    return true
}

export function roleGuard(allowedRoles){
    const session = getSession()
    return allowedRoles.includes(session.role)
}