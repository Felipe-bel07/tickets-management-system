import { createElement, Pencil, UserRoundPlus, Trash2 } from "lucide";

// Convierte iconos de lucide en SVG para usarlos dentro de botones.
const iconSVG = (icon, attrs = {}) => createElement(icon, attrs).outerHTML;

// Renderiza una fila de la tabla de tickets del administrador.
export function ticketTr(ticket) {
  return `<tr>
              <td><span class="ticket-id">tk${ticket.id}</span></td>
              <td>
                <div class="ticket-title">${ticket.name}</div>
              </td>
              <td>
                <div class="requester">
                  <img src="../img/perfil.png" alt="">
                  <div class="name">${ticket.workspace}</div>
                </div>
              </td>
              <td>
                <div class="tech-wrap">
                  <span class="tech-name">${ticket.date}</span>
                </div>
              </td>
              <td><span class="badge ">${ticket.startHour}</span></td>
              <td><span class="badge"><span style="background:var(--orange)"></span>${ticket.endHour}</span></td>
              <td><span class="badge ">${ticket.reason}</span></td>
              <td><span class="badge ">${ticket.status}</span></td>

              <td>
                <div class="action-btns">
                  <button class="action-btn edit" data-ticket-id="${ticket.id}" title="Editar">${iconSVG(Pencil)}  </button>
                  <button class="action-btn del" title="Eliminar" data-id=${ticket.id}>${iconSVG(Trash2)}  </button>
                </div>
              </td>
            </tr>`
}
