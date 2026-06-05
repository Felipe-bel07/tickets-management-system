import { checkEmailExists, registerUser } from '../../store/auth.js'
import registerHTML from './register.html?raw'

// Inyecta el HTML de registro y registra el evento de submit
export function renderRegister() {
    const app = document.getElementById('app')
    app.innerHTML = registerHTML
    document.getElementById('register-form').addEventListener('submit', handleRegister)
}

// Verifica que el correo no exista y crea el usuario con rol 'client'
async function handleRegister(event) {
    event.preventDefault()

    const name = document.getElementById('nombre').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    const errorMsg = document.getElementById('error-msg')
    const successMsg = document.getElementById('success-msg')

    errorMsg.classList.add('d-none')
    successMsg.classList.add('d-none')

    try {
        const exists = await checkEmailExists(email)

        if (exists) {
            errorMsg.textContent = 'Este correo ya está registrado.'
            errorMsg.classList.remove('d-none')
            return
        }

        await registerUser(name, email, password)

        successMsg.textContent = 'Cuenta creada exitosamente. Redirigiendo...'
        successMsg.classList.remove('d-none')

        setTimeout(() => { window.location.hash = '#/login' }, 2000)
    } catch (error) {
        errorMsg.textContent = 'Error al conectar con el servidor.'
        errorMsg.classList.remove('d-none')
    }
}
