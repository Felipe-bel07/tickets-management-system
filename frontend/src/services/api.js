import { authClient, dataClient } from "../utils/https";


// Obtiene todos los tickets para tablas, cards y filtros locales.
export async function getTickets() {
    try {
        const response = await dataClient.get('/tickets');
        return response.data|| [];

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Obtiene tickets por usuario solicitante.
export async function getTicketsById(id) {
    try {
        const response = await dataClient.get(`/tickets?serId=${id}`);
        return response.data|| [];

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Obtiene tickets asociados a un tecnico por nombre.
export async function getTicketsByTechnician(name) {
    try {
        const response = await dataClient.get(`/tickets?Technician=${name}`);
        return response.data|| [];

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Crea un ticket y fuerza un id secuencial basado en el tamano del arreglo.
export async function postTicket(ticket) {
      try {
        const ticketsResponse = await dataClient.get('/tickets');
        const nextId = String(ticketsResponse.data.length + 1);
        ticket.id = nextId;
        const response = await dataClient.post(`/tickets`,ticket);
        // json-server v1 puede generar un id aleatorio aunque se envie uno.
        if (response.data.id !== nextId) {
            await dataClient.patch(`/tickets/${response.data.id}`, { id: nextId });
        }
     } catch (error) {
        console.error(error);
        return [];
    }
}

// Busca usuarios por rol; se usa para cargar tecnicos disponibles.
export async function getUsuarios(rol) {
    try {
        const response = await authClient.get(`/users?role=${rol}`);
        return response.data|| [];

    } catch (error) {
        console.error(error);
        return [];
    }
}

// Asigna un tecnico a un ticket existente.
export async function updateTicketTech(ticketId, techId) {
    try {
        const ticketResponse = await dataClient.get(`/tickets/${ticketId}`);
        const ticketData = ticketResponse.data;
        ticketData.Technician = techId;
        
        const response = await dataClient.put(`/tickets/${ticketId}`, ticketData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando técnico:', error);
        throw error;
    }
}


// Obtiene un ticket puntual para llenar el modal de edicion.
export async function getTicketById(ticketId) {
    try {
        const response = await dataClient.get(`/tickets/${ticketId}`);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo ticket:', error);
        throw error;
    }
}

// Actualiza los campos editables de un ticket.
export async function updateTicket(ticketId, newTicketData) {
    try {
        const ticketResponse = await dataClient.get(`/tickets/${ticketId}`);
        const ticketData = ticketResponse.data;        

        ticketData.userID = newTicketData.userID;
        ticketData.name = newTicketData.name;
        ticketData.workspace = newTicketData.workspace;
        ticketData.startHour = newTicketData.startHour;
        ticketData.endHour = newTicketData.endHour;
        ticketData.priority = newTicketData.priority;
        ticketData.caseType = newTicketData.caseType;
        if (newTicketData.status) {
            ticketData.status = newTicketData.status;
        }
        
        const response = await dataClient.put(`/tickets/${ticketId}`, ticketData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando ticket:', error);
        throw error;
    }
}

// Elimina un ticket por id.
export async function deleteTicket(id) {
    try {
        const response = await dataClient.delete(`/tickets/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
} 
