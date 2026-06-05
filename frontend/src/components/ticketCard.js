import { createElement, Pencil } from "lucide";

// Convierte un icono de lucide en SVG listo para insertar en HTML string.
const iconSVG = (icon, attrs = {}) => createElement(icon, attrs).outerHTML;

// Renderiza una tarjeta de ticket para la vista de cliente.
export function ticketCard(ticket) {
    // El cliente puede editar si el ticket esta pending.
    const isApproved = ticket.status === "Pending" 
    const canEdit = !isApproved;
    const editButton = isApproved ? `<button class="action-btn edit" data-ticket-id="${ticket.id}" title="Editar">${iconSVG(Pencil)}</button>` : "";

    return `<article class="ticket-card">


            <h3 class="card-title">${ticket.reason}</h3>
            <p class="card-cat">${ticket.date} - ${ticket.workspace}</p>

            <footer class="card-footer">
            <address class="requester">
                <img src="../img/perfil.png" alt="Erica Johnson">
                <p>
                <strong class="req-name">${ticket.name}</strong>
                </p>
            </address>
            <div class="action-btns">
                ${editButton}
                <button class="action-btn del" title="Eliminar" data-id=${ticket.id}>X</button>
                <span class="ticket-id">tk${ticket.id}</span>

            </div>
            </footer>
     </article>`
}
