import { getTicketsByUser, createTicket, updateTicket } from '../../../services/ticketService.js'
import { getSession } from '../../../store/session.js'

// Estado local: tickets del técnico y id del ticket en edición
let ticketsList   = []
let currentEditId = null

// Punto de entrada: carga y muestra los tickets creados por el técnico en sesión
export async function renderTecnicoContent(container) {
    container.innerHTML = '<p class="loading-msg">Cargando tickets...</p>'
    const session = getSession()
    try {
        const tickets = await getTicketsByUser(session.id)
        ticketsList = tickets
        container.innerHTML = buildHTML(tickets)
        attachEvents(container, session)
    } catch {
        container.innerHTML = '<p class="error-msg">Error al cargar tickets.</p>'
    }
}

// Construye tabla de tickets del técnico + modal de formulario
function buildHTML(tickets) {
    const rows = tickets.length
        ? tickets.map(ticket => `
            <tr>
                <td>${ticket.ticketName}</td>
                <td>${ticket.caseType}</td>
                <td class="cell-truncate" title="${ticket.description}">${ticket.description}</td>
                <td><span class="badge ${priorityBadge(ticket.priority)}">${ticket.priority}</span></td>
                <td><span class="badge ${statusBadge(ticket.status)}">${ticket.status}</span></td>
                <td class="td-actions">
                    <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${ticket.id}">Editar</button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="6" style="text-align:center;padding:24px;color:#6b7280">No has creado tickets aún</td></tr>'

    return `
        <div class="section-header">
            <h4 class="section-title">Mis Tickets</h4>
            <button class="btn btn-primary" id="btn-new-ticket">+ Nuevo Ticket</button>
        </div>

        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th><th>Tipo</th><th>Descripción</th>
                        <th>Prioridad</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <!-- Modal crear / editar ticket del técnico -->
        <div class="modal" id="ticketModal">
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="modal-title" id="modal-title">Nuevo Ticket</span>
                    <button class="btn-close" id="btn-close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <form id="ticket-form">
                        <div class="form-group">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="f-ticketName" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tipo de caso</label>
                            <select class="form-select" id="f-caseType">
                                <option value="incident">Incidente</option>
                                <option value="request">Requerimiento</option>
                                <option value="support">Soporte</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" id="f-description" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Prioridad</label>
                            <select class="form-select" id="f-priority">
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="f-status">
                                <option value="In Progress">En Proceso</option>
                                <option value="Assigned">Asignado</option>
                                <option value="Solved">Solucionado</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btn-save-ticket">Guardar</button>
                </div>
            </div>
        </div>
    `
}

// Retorna la clase CSS del badge según la prioridad
function priorityBadge(p) {
    if (p === 'high')   return 'badge-danger'
    if (p === 'medium') return 'badge-warning'
    return 'badge-info'
}

// Retorna la clase CSS del badge según el estado
function statusBadge(s) {
    if (s === 'Solved')   return 'badge-success'
    if (s === 'Assigned') return 'badge-warning'
    return 'badge-secondary'
}

// Muestra el modal añadiendo la clase .active
function showModal() {
    document.getElementById('ticketModal').classList.add('active')
}

// Oculta el modal quitando la clase .active
function hideModal() {
    document.getElementById('ticketModal').classList.remove('active')
    currentEditId = null
}

// Registra los listeners: nuevo ticket, cerrar modal, guardar y editar por delegación
function attachEvents(container, session) {
    document.getElementById('btn-new-ticket').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Nuevo Ticket'
        document.getElementById('ticket-form').reset()
        showModal()
    })

    document.getElementById('btn-close-modal').addEventListener('click', hideModal)
    document.getElementById('btn-cancel-modal').addEventListener('click', hideModal)

    // Cierra el modal al hacer clic en el overlay
    document.getElementById('ticketModal').addEventListener('click', (e) => {
        if (e.target.id === 'ticketModal') hideModal()
    })

    document.getElementById('btn-save-ticket').addEventListener('click', () => handleSave(session))

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-edit')) openEditModal(e.target.dataset.id)
    })
}

// Rellena el modal con los datos del ticket a editar
function openEditModal(id) {
    const ticket = ticketsList.find(t => t.id === id)
    if (!ticket) return
    currentEditId = id
    document.getElementById('modal-title').textContent  = 'Editar Ticket'
    document.getElementById('f-ticketName').value       = ticket.ticketName
    document.getElementById('f-caseType').value         = ticket.caseType
    document.getElementById('f-description').value      = ticket.description
    document.getElementById('f-priority').value         = ticket.priority
    document.getElementById('f-status').value           = ticket.status
    showModal()
}

// Guarda el ticket; el técnico se auto-asigna como responsable al crear
async function handleSave(session) {
    const ticketData = {
        ticketName:       document.getElementById('f-ticketName').value.trim(),
        caseType:         document.getElementById('f-caseType').value,
        description:      document.getElementById('f-description').value.trim(),
        priority:         document.getElementById('f-priority').value,
        status:           document.getElementById('f-status').value,
        Technician:       session.name,
        requestingClient: session.name,
        userId:           session.id
    }

    if (!ticketData.ticketName || !ticketData.description) {
        alert('Por favor completa todos los campos requeridos.')
        return
    }

    try {
        currentEditId
            ? await updateTicket(currentEditId, ticketData)
            : await createTicket(ticketData)
        hideModal()
        await renderTecnicoContent(document.getElementById('dashboard-content'))
    } catch {
        alert('Error al guardar el ticket.')
    }
}
