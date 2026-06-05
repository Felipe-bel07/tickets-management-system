const TIMEOUT_DURATION =  5 * 60 * 1000
let inactivityTimer = null

//Guardar el usuario que inicia sesión el LS

export function saveSession(user){
    localStorage.setItem('user', JSON.stringify(user))
    startInactivityTimer()
}

//Obtener el usuario que esta guardado en el LS (null si no hay nada)
export function getSession(){
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null 
}

//Logout
export function clearSession(){
    localStorage.removeItem('user')
    clearTimeout(inactivityTimer)
}

function startInactivityTimer(){
    clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(() => {
        clearSession()
        window.location.hash = '#/login'
        alert('Tu sesión expiro por inactividad')
    }, TIMEOUT_DURATION)
}

export function resetInactivityTimer(){
 if (getSession()){
    startInactivityTimer()
 }   
}
