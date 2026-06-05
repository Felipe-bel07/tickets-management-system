import { dataApi, authApi } from '../utils/https.js'

// Obtiene todos los tickets del sistema
export async function getAllTickets() {
    const res = await dataApi.get('/tickets')
    return res.data
}

// Obtiene los tickets filtrados por el id del usuario que los creó
export async function getTicketsByUser(userId) {
    const res = await dataApi.get(`/tickets?userId=${userId}`)
    return res.data
}

// Crea un nuevo ticket enviando el objeto completo
export async function createTicket(ticket) {
    const res = await dataApi.post('/tickets', ticket)
    return res.data
}

// Actualiza parcialmente un ticket por su id (solo los campos enviados)
export async function updateTicket(id, changes) {
    const res = await dataApi.patch(`/tickets/${id}`, changes)
    return res.data
}

// Elimina un ticket por id (solo el admin puede llamar esto)
export async function deleteTicket(id) {
    await dataApi.delete(`/tickets/${id}`)
}

// Obtiene todos los usuarios con rol 'tech' para el selector de técnicos
export async function getTechnicians() {
    const res = await authApi.get('/users?role=tech')
    return res.data
}
