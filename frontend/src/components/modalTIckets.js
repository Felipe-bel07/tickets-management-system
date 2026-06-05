import { getTicketById, postTicket, updateTicket } from "../services/api.js";
import { loadHTML } from "../utils/loadHtml.js";

// Inicializa el modal de crear/editar tickets y recibe un callback para refrescar la vista.
export async function initModalTicket(refreshTickets) {
  // Inyecta el HTML del modal solo si no existe ya en el DOM
  if (!document.getElementById('modal-ticket')) {
    const modalHTML = await loadHTML('/src/views/modalTicket.html');
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('modal-ticket');
  const btnNew = document.querySelector('.btn-new');
  const btnClose = document.getElementById('modal-close');
  const btnCancel = document.getElementById('btn-cancel');
  const modalTitle = document.getElementById('ticket-modal-title');
  const btnSubmit = document.getElementById('ticket-submit');
  const form = document.getElementById("form-ticket");
  let ticketIdActual = null;

  // Abre el modal en modo crear.
  btnNew.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const statusSelect = document.getElementById("ticket-status");

    ticketIdActual = null;
    form.reset();
    modalTitle.textContent = "New reservation";
    btnSubmit.textContent = "Create a reservation";
    statusSelect.value = "Pending";
    showStatusByRole(user);
    modal.showModal();
  });

  // Cierra el modal y limpia el modo edicion.
  btnClose.addEventListener('click', () => {
    ticketIdActual = null;
    modal.close();
  });
  btnCancel.addEventListener('click', () => {
    ticketIdActual = null;
    modal.close();
  });

  // Abre el modal en modo editar cuando se presiona un boton .edit.
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.edit')) {
      const user = JSON.parse(localStorage.getItem("user"))
      ticketIdActual = e.target.closest('.edit').dataset.ticketId;
      const ticket = await getTicketById(ticketIdActual);
      const statusSelect = document.getElementById("ticket-status");

      if (!canEditTicket(user, ticket)) {
        // Si el usuario no tiene permiso, no se abre el modal.
        ticketIdActual = null;
        return;
      }

      document.getElementById("ticket-title").value = ticket.name;
      document.getElementById("ticket-desc").value = ticket.workspace;
      document.getElementById("reservation-date").value = ticket.date;
      document.getElementById("reservation-start").value = ticket.startHour;
      document.getElementById("reservation-end").value = ticket.endHour;
      document.getElementById("reservation-reason").value = ticket.reason
      modalTitle.textContent = "Update reservation";
      btnSubmit.textContent = "Update reservation";
      statusSelect.value = ticket.status;
      showStatusByRole(user);

      modal.showModal();
    }
  });

  // Decide si el formulario crea un ticket nuevo o actualiza uno existente.
  form.onsubmit = async (e) => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem("user"))

    const ticket = {
      userId: user.id,
      name: document.getElementById("ticket-title").value,
      workspace: document.getElementById("ticket-desc").value,
      date: document.getElementById("reservation-date").value,
      startHour: document.getElementById("reservation-start").value,
      endHour: document.getElementById("reservation-end").value,
      reason: document.getElementById("reservation-reason").value,
      status: document.getElementById("ticket-status").value,
    }

    if (user.role !== "client") {
      // Admin y tecnico pueden definir estado desde el modal.
      ticket.status = document.getElementById("ticket-status").value
    }

    if (ticketIdActual) {
      // Si hay ticketIdActual, el formulario esta en modo actualizacion.
      await updateTicket(ticketIdActual, ticket)
      if (refreshTickets) {
        await refreshTickets()
      }
      ticketIdActual = null
      modal.close()
      return
    }

    if (user.role === "client") {
      // Los clientes siempre crean tickets en progreso.
      ticket.status = "Pending"
    }

    await postTicket(ticket)
   
    modal.close()

  }
}

// Define permisos para editar segun rol, propiedad del ticket y estado.
function canEditTicket(user, ticket) {
  const isOwner = ticket.userId == user.id;
  const isClosed = ticket.status === "Approved" || ticket.status === "Canceled" ;

  if (user.role === "admin") {
    return true;
  }

  if (user.role === "tech") {
    return true;
  }

  return isOwner && (isClosed);
}

// Muestra u oculta el campo status segun el rol del usuario.
function showStatusByRole(user) {
  const statusGroup = document.getElementById("ticket-status-group");
  const statusSelect = document.getElementById("ticket-status");
  const canChangeStatus = user.role === "admin" || user.role === "tech";

  statusGroup.style.display = canChangeStatus ? "" : "none";
  statusSelect.disabled = !canChangeStatus;
}
