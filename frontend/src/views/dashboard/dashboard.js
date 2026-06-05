import { getSession, clearSession } from '../../store/session.js'
import dashboardHTML from './dashboard.html?raw'
import { renderAdminContent } from './roles/admin.js'
import { renderTecnicoContent } from './roles/tecnico.js'
import { renderClienteContent } from './roles/cliente.js'

export function renderDashboard() {
    const app = document.getElementById('app')
    app.innerHTML = dashboardHTML

    const session = getSession()

    const roleLabels = { admin: 'Administrador', tech: 'Técnico', client: 'Cliente' }
    document.getElementById('welcome-msg').textContent = `Hola, ${session.name}`
    document.getElementById('role-badge').textContent = roleLabels[session.role] || session.role

    document.getElementById('btn-logout').addEventListener('click', handleLogout)

    const content = document.getElementById('dashboard-content')

    if (session.role === 'admin') {
        renderAdminContent(content)
    } else if (session.role === 'tech') {
        renderTecnicoContent(content)
    } else if (session.role === 'client') {
        renderClienteContent(content)
    }
}

function handleLogout() {
    clearSession()
    window.location.hash = '#/login'
}