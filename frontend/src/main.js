import bcrypt, { hash } from "bcryptjs"
import { router } from "./router/router.js";
import { resetInactivityTimer, getSession } from "./store/session.js";


let hp = "$2b$10$zN7Q5UWhKXW2pSLCvqQ9pOjWgEVmH/d9OCBy/9QmVOD/TPY0Y0sXm"

/**
 * Navega entre rutas sin recargar.
 *
 * @param {string} url
 */
export function navigateTo(url) {
    history.pushState(null, null, url);
    router();

    if (getSession()) {
        resetInactivityTimer();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Carga la vista que corresponde a la URL inicial.
    router()
})

// Permite volver y avanzar con el navegador sin recargar la aplicacion.
window.addEventListener('popstate', router);

const activityEvents = ["click", "mousemove", "keydown", "scroll", "touchstart"];

activityEvents.forEach((event) => {
    // Reinicia el temporizador de inactividad ante acciones del usuario.
    window.addEventListener(event, resetInactivityTimer);
});

