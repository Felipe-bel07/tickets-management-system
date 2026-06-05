import { loginUser } from '../../store/auth.js'
import { saveSession } from '../../store/session.js'
import loginHTML from './login.html?raw'

// Inyecta el HTML del login y registra el evento de submit
export function renderLogin() {
    const app = document.getElementById('app')
    app.innerHTML = loginHTML
    document.getElementById('login-form').addEventListener('submit', handleLogin)
}

// Valida credenciales contra el json-server de autenticación y guarda la sesión
async function handleLogin(event) {
    event.preventDefault()

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    const errorMsg = document.getElementById('error-msg')

    errorMsg.classList.add('d-none')

    try {
        const users = await loginUser(email, password)

        if (users.length === 0) {
            errorMsg.textContent = 'Correo o contraseña incorrectos.'
            errorMsg.classList.remove('d-none')
            return
        }

        saveSession(users[0])
        window.location.hash = '#/dashboard'
    } catch (error) {
        errorMsg.textContent = 'Error al conectar con el servidor.'
        errorMsg.classList.remove('d-none')
    }
}
