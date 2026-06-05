import { initModalTicket } from "../components/modalTIckets.js";
import { ticketCard } from "../components/ticketCard.js";
import { getTickets, deleteTicket } from "../services/api.js";
import { loadHTML } from "../utils/loadHtml.js";
import { clearSession } from "../store/session.js";

// Guarda el texto buscado para conservarlo al refrescar las cards.
let ticketSearch = "";

// Pinta la vista del cliente y prepara modal, logout y busqueda.
export async function renderUser() {
    const container = document.getElementById("app");
    container.innerHTML = await loadHTML('/src/views/user.html');
    renderTickets()
    await initModalTicket(renderTickets)
    initLogout()
    initSearch()
    attachDelete()

}

// Conecta el boton de logout.
function initLogout() {
    const logoutButton = document.getElementById("btn-logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            clearSession();
        });
    }
}

// Renderiza solo los tickets del usuario actual y aplica el filtro.
export async function renderTickets() {
    const container = document.getElementById("tickets")
    const user = JSON.parse(localStorage.getItem("user"))
    const tickets = await getTickets();
    const userTickets = tickets.filter(ticket => ticket.userId == user.id);
    const filteredTickets = filterTickets(userTickets, ticketSearch);
    container.innerHTML = filteredTickets.map(ticket => ticketCard(ticket)).join('');
}

// Conecta la barra de busqueda del topbar.
function initSearch() {
    const searchInput = document.getElementById("ticket-search");
    if (!searchInput) return;

    searchInput.value = ticketSearch;
    searchInput.addEventListener("input", async (event) => {
        ticketSearch = event.target.value;
        await renderTickets();
    });
}

// Busca coincidencias en los campos principales del ticket.
function filterTickets(tickets, search) {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return tickets;

    return tickets.filter((ticket) => {
        return [
            ticket.id,
            ticket.ticketName,
            ticket.description,
            ticket.requestingClient,
            ticket.Technician,
            ticket.priority,
            ticket.status,
            ticket.caseType,
        ].some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch));
    });
}

function attachDelete() {
    const container = document.getElementById("tickets");
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
        await renderTickets();
        alert("Reservation deleted successfully.");
    } catch (error) {
        console.error(error);
        alert("Error deleting the reservation.");
    }
}
