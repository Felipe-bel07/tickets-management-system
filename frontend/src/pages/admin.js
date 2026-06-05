import { deleteTicket, getTickets } from "../services/api.js";
import { loadHTML } from "../utils/loadHtml.js";
import { ticketTr } from "../components/ticketTr.js";
import { initModalTicket } from "../components/modalTIckets.js";
import { initModalTicketTech } from "../components/modaladdTech.js";
import { addTech } from "../components/tecnicos.js";
import { renderTechPanel } from "../components/apartadodeTecnicos.js";
import { clearSession } from "../store/session";

// Mantiene el texto de busqueda aunque se vuelva a renderizar la tabla.
let adminSearch = "";

// Pinta la vista de administrador e inicializa sus acciones.
export async function renderAdmin(){
    const container = document.getElementById("app");
    container.innerHTML = await loadHTML('/src/views/admin.html');
    renderTicketsToAdmin()
    await initModalTicket(renderTicketsToAdmin)
    attachDelete()
    await initModalTicketTech()
    await renderTechPanel();
    attachLogout();
    attachSearch();
}

// Carga tickets, aplica el filtro de busqueda y pinta las filas de la tabla.
export async function renderTicketsToAdmin() {
    const container = document.getElementById("tbody");
    const tickets = await getTickets();
    const filteredTickets = filterTickets(tickets, adminSearch);
    container.innerHTML = filteredTickets.map(ticket => ticketTr(ticket)).join('');
    await renderTechPanel();
}

// Conecta la barra de busqueda de la tabla admin.
function attachSearch() {
    const searchInput = document.getElementById("admin-search");
    if (!searchInput) return;

    searchInput.value = adminSearch;
    searchInput.addEventListener("input", async (event) => {
        adminSearch = event.target.value;
        await renderTicketsToAdmin();
    });
}

// Filtra tickets por cualquier campo visible o relevante.
function filterTickets(tickets, search) {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return tickets;

    return tickets.filter((ticket) => {
        return [
            ticket.id,
            ticket.name,
            ticket.workspace,
            ticket.date,
            ticket.startHour,
            ticket.endHour,
            ticket.reason,
            ticket.status,
        ].some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch));
    });


}

// Usa delegacion de eventos para que los botones delete funcionen tras re-render.
function attachDelete() {
    const container = document.getElementById("tbody");
    if (!container) return;
    container.addEventListener("click", oneDeleteClick);
}

// Elimina el ticket seleccionado y refresca la tabla.
async function oneDeleteClick(event) {
    const button = event.target.closest("button.del");
    if (!button) return;

    const id = button.dataset.id;
    if (!id) return;

    const confirmed = confirm("Do you confirm deleting this reservation?");
    if (!confirmed) return;

    try {
        await deleteTicket(id);
        await renderTicketsToAdmin();
        alert("Reservation deleted successfully.");
    } catch (error) {
        console.error(error);
        alert("Error deleting the reservation.");
    }
}

// Conecta el boton de logout del topbar.
function attachLogout() {
    const logoutButton = document.querySelector(".links-pill");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
        clearSession();
    });
}
