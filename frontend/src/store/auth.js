import { authApi } from '../utils/https.js'

// Consulta usuario por email y password en el servicio de autenticación
export async function loginUser(email, password) {
    const res = await authApi.get(`/users?email=${email}&password=${password}`)
    return res.data
}

// Verifica si un correo ya está registrado en el sistema
export async function checkEmailExists(email) {
    const res = await authApi.get(`/users?email=${email}`)
    return res.data.length > 0
}

// Registra un nuevo usuario con rol 'client' por defecto
export async function registerUser(name, email, password) {
    const res = await authApi.post('/users', {
        name,
        email,
        password,
        role: 'client',
        isActive: true
    })
    return res.data
}
