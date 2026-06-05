import deniedHTML from './denied.html?raw'
import { getSession } from '../../store/session.js'

export function renderDenied() {
    const app = document.getElementById('app')
    app.innerHTML = deniedHTML

    // Personaliza el mensaje según el rol
    const session = getSession()
    const link = document.getElementById('back-link')

    if (session) {
        link.href = '#/dashboard'
        link.textContent = 'Volver al dashboard'
    } else {
        link.href = '#/login'
        link.textContent = 'Ir al login'
    }
}