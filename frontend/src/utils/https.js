/**
 * 
 * Axios HTTP Client
 * Configuración centralizada Axios.
 */
import axios from 'axios';

/**
 * URL API desde variables de entorno
 * import.meta.env es soportado por Vite
 */
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const DATA_URL = import.meta.env.VITE_DATA_URL;
const CONTENT_TYPE = import.meta.env.VITE_CONTENT_TYPE;
// Number() convierte el string del .env al tipo correcto que espera Axios
const TIME_OUT = Number(import.meta.env.VITE_TIME_OUT);
/**
 * Instancia global Axios
 */
export const authApi  = axios.create({
    baseURL: AUTH_URL,
    timeout: TIME_OUT,
    headers: {
        'Content-Type': CONTENT_TYPE
    }
});


export const dataApi  = axios.create({
    baseURL: DATA_URL,
    timeout: TIME_OUT,
    headers: {
        'Content-Type': CONTENT_TYPE
    }
});

