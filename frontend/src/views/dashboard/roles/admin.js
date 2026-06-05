import { getAllTickets, createTicket, updateTicket, deleteTicket, getTechnicians } from '../../../services/ticketService.js'
import { getSession } from '../../../store/session.js'

// Estado local: evita re-fetchear en cada acción de la misma sesión
let ticketsList = []
let techniciansList = []
let currentEditId = null

// Punto de entrada: carga datos y renderiza la vista completa del admin
export async function renderAdminContent(container) {
    container.innerHTML = '<p class="loading-msg">Cargando tickets...</p>'
    try {
        const [tickets, technicians] = await Promise.all([getAllTickets(), getTechnicians()])
        ticketsList = tickets
        techniciansList = technicians
        container.innerHTML = buildHTML(tickets, technicians)
        attachEvents(container)
    } catch {
        container.innerHTML = '<p class="error-msg">Error al cargar los datos.</p>'
    }
}

// Construye el HTML completo: encabezado + tabla + modal de crear/editar
function buildHTML(tickets, technicians) {
    const techOptions = technicians
        .map(t => `<option value="${t.name}">${t.name}</option>`)
        .join('')

    const rows = tickets.length
        ? tickets.map(buildRow).join('')
        : '<tr><td colspan="8" style="text-align:center;padding:24px;color:#6b7280">No hay tickets registrados</td></tr>'

    return `
        <div class="section-header">
            <h4 class="section-title">Gestión de Tickets</h4>
            <button class="btn btn-primary" id="btn-new-ticket">+ Nuevo Ticket</button>
        </div>

        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th><th>Tipo</th><th>Descripción</th>
                        <th>Prioridad</th><th>Estado</th><th>Técnico</th>
                        <th>Cliente</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tickets-body">${rows}</tbody>
            </table>
        </div>

        <!-- Modal crear / editar ticket -->
        <div class="modal" id="ticketModal">
            <div class="modal-dialog">
                <div class="modal-header">
                    <span class="modal-title" id="modal-title">Nuevo Ticket</span>
                    <button class="btn-close" id="btn-close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <form id="ticket-form">
                        <div class="form-group">
                            <label class="form-label">Nombre del ticket</label>
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
                            <label class="form-label">Técnico asignado</label>
                            <select class="form-select" id="f-technician">
                                <option value="">Sin asignar</option>
                                ${techOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="f-status">
                                <option value="In Progress">En Proceso</option>
                                <option value="Assigned" disabled>Asignado</option>
                                <option value="Solved">Solucionado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Cliente solicitante</label>
                            <input type="text" class="form-control" id="f-requestingClient" required />
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

// Genera una fila <tr> con los datos de un ticket
function buildRow(ticket) {
    return `
        <tr>
            <td>${ticket.ticketName}</td>
            <td>${ticket.caseType}</td>
            <td class="cell-truncate" title="${ticket.description}">${ticket.description}</td>
            <td><span class="badge ${priorityBadge(ticket.priority)}">${ticket.priority}</span></td>
            <td><span class="badge ${statusBadge(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.Technician || '<span class="text-muted">Sin asignar</span>'}</td>
            <td>${ticket.requestingClient}</td>
            <td class="td-actions">
                <button class="btn btn-sm btn-outline-primary btn-edit" data-id="${ticket.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${ticket.id}">Eliminar</button>
            </td>
        </tr>
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

// Oculta el modal quitando la clase .active y limpia el id de edición
function hideModal() {
    document.getElementById('ticketModal').classList.remove('active')
    currentEditId = null
}

// Registra todos los listeners de la vista admin
function attachEvents(container) {
    // Abre el modal vacío para crear un ticket nuevo
    document.getElementById('btn-new-ticket').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Nuevo Ticket'
        document.getElementById('ticket-form').reset()
        document.getElementById('f-status').querySelector('[value="Assigned"]').disabled = true
        showModal()
    })

    // Cierra el modal con el botón ✕ o con Cancelar
    document.getElementById('btn-close-modal').addEventListener('click', hideModal)
    document.getElementById('btn-cancel-modal').addEventListener('click', hideModal)

    // Cierra el modal al hacer clic sobre el overlay (fuera del diálogo)
    document.getElementById('ticketModal').addEventListener('click', (e) => {
        if (e.target.id === 'ticketModal') hideModal()
    })

    // Habilita "Asignado" solo cuando hay técnico seleccionado
    document.getElementById('f-technician').addEventListener('change', toggleAssignedOption)

    document.getElementById('btn-save-ticket').addEventListener('click', handleSave)

    // Delegación de eventos para los botones de editar y eliminar de cada fila
    container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit'))   openEditModal(e.target.dataset.id)
        if (e.target.classList.contains('btn-delete')) await handleDelete(e.target.dataset.id)
    })
}

// Activa o desactiva la opción "Asignado" según si hay técnico seleccionado
function toggleAssignedOption() {
    const hasTech = !!document.getElementById('f-technician').value
    const statusSelect = document.getElementById('f-status')
    const assignedOpt  = statusSelect.querySelector('[value="Assigned"]')
    assignedOpt.disabled = !hasTech
    if (!hasTech && statusSelect.value === 'Assigned') statusSelect.value = 'In Progress'
}

// Rellena el modal con los datos del ticket seleccionado para editar
function openEditModal(id) {
    const ticket = ticketsList.find(t => t.id === id)
    if (!ticket) return
    currentEditId = id
    document.getElementById('modal-title').textContent = 'Editar Ticket'
    document.getElementById('f-ticketName').value      = ticket.ticketName
    document.getElementById('f-caseType').value        = ticket.caseType
    document.getElementById('f-description').value     = ticket.description
    document.getElementById('f-priority').value        = ticket.priority
    document.getElementById('f-technician').value      = ticket.Technician || ''
    // Habilita "Asignado" solo si el ticket ya tiene técnico asignado
    document.getElementById('f-status').querySelector('[value="Assigned"]').disabled = !ticket.Technician
    document.getElementById('f-status').value          = ticket.status
    document.getElementById('f-requestingClient').value = ticket.requestingClient
    showModal()
}

// Recoge el formulario y ejecuta POST (crear) o PATCH (editar)
async function handleSave() {
    const session    = getSession()
    const ticketData = {
        ticketName:       document.getElementById('f-ticketName').value.trim(),
        caseType:         document.getElementById('f-caseType').value,
        description:      document.getElementById('f-description').value.trim(),
        priority:         document.getElementById('f-priority').value,
        Technician:       document.getElementById('f-technician').value,
        status:           document.getElementById('f-status').value,
        requestingClient: document.getElementById('f-requestingClient').value.trim(),
        userId:           session.id
    }

    if (!ticketData.ticketName || !ticketData.description || !ticketData.requestingClient) {
        alert('Por favor completa todos los campos requeridos.')
        return
    }

    try {
        currentEditId
            ? await updateTicket(currentEditId, ticketData)
            : await createTicket(ticketData)
        hideModal()
        await renderAdminContent(document.getElementById('dashboard-content'))
    } catch {
        alert('Error al guardar el ticket. Intenta de nuevo.')
    }
}

// Elimina el ticket tras confirmación y re-renderiza la tabla
async function handleDelete(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este ticket?')) return
    try {
        await deleteTicket(id)
        await renderAdminContent(document.getElementById('dashboard-content'))
    } catch {
        alert('Error al eliminar el ticket.')
    }
}
