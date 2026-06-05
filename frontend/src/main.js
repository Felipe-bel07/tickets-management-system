import { getSession, resetInactivityTimer } from './store/session.js'
import { router } from './router/router.js'


document.addEventListener('click', resetInactivityTimer)
document.addEventListener('keydown', resetInactivityTimer)

window.addEventListener('hashchange', router)

window.addEventListener('load', router)