// Configuración del Canvas
const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

// Elementos de la Interfaz
const txtPuntos = document.getElementById("puntos");
const txtTiempo = document.getElementById("tiempo");
const txtMensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById('btn-reiniciar');

// Estado del Juego
let puntos = 0;
let tiempo = 10;
let juegoActivo = true;
let temporizador = null;

// Datos del Personaje (Cazador)
let personajeX = 230;
let personajeY = 150;
const anchoPersonaje = 40;
const altoPersonaje = 40;
const velocidad = 15;

// Datos del Objetivo (Premio)
let objetivoX = 0;
let objetivoY = 0;
const radioObjetivo = 12; // Será un círculo verde

// --- FUNCIONES DE DIBUJO ---

function dibujarJuego() {
    // Limpiar pantalla
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Dibujar Objetivo (Moneda/Fruta)
    ctx.beginPath();
    ctx.arc(objetivoX, objetivoY, radioObjetivo, 0, Math.PI * 2);
    ctx.fillStyle = "#4caf50"; // Verde brillante
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1b5e20";
    ctx.stroke();
    ctx.closePath();

    // 2. Dibujar Personaje (Cazador Amarillo)
    ctx.fillStyle = "gold";
    ctx.fillRect(personajeX, personajeY, anchoPersonaje, altoPersonaje);

    // Ojos
    ctx.fillStyle = "black";
    ctx.fillRect(personajeX + 8, personajeY + 10, 6, 6);
    ctx.fillRect(personajeX + 26, personajeY + 10, 6, 6);

    // Sonrisa
    ctx.beginPath();
    ctx.arc(personajeX + 20, personajeY + 23, 10, 0, Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// --- LÓGICA DEL JUEGO ---

function moverObjetivo() {
    // Coloca el objetivo en una posición aleatoria dentro del canvas respetando los bordes
    objetivoX = Math.floor(Math.random() * (canvas.width - radioObjetivo * 2)) + radioObjetivo;
    objetivoY = Math.floor(Math.random() * (canvas.height - radioObjetivo * 2)) + radioObjetivo;
}

function verificarColision() {
    // CORREGIDO: Lógica matemática por bordes para que detecte la colisión fácilmente
    let personajeIzquierda = personajeX;
    let personajeDerecha = personajeX + anchoPersonaje;
    let personajeArriba = personajeY;
    let personajeAbajo = personajeY + altoPersonaje;

    let objetivoIzquierda = objetivoX - radioObjetivo;
    let objetivoDerecha = objetivoX + radioObjetivo;
    let objetivoArriba = objetivoY - radioObjetivo;
    let objetivoAbajo = objetivoY + radioObjetivo;

    if (personajeDerecha >= objetivoIzquierda &&
        personajeIzquierda <= objetivoDerecha &&
        personajeAbajo >= objetivoArriba &&
        personajeArriba <= objetivoAbajo) {
        
        puntos++;
        if (txtPuntos) txtPuntos.textContent = puntos;
        if (txtMensaje) txtMensaje.textContent = "¡Cazado! 🎯";
        moverObjetivo();
    }
}

function iniciarTemporizador() {
    // Evita duplicar temporizadores
    if (temporizador) return; 

    temporizador = setInterval(() => {
        tiempo--;
        if (txtTiempo) txtTiempo.textContent = tiempo;

        if (tiempo <= 0) {
            clearInterval(temporizador);
            temporizador = null;
            juegoActivo = false;
            
            if (txtMensaje) {
                txtMensaje.textContent = `¡Tiempo agotado! Puntuación final: ${puntos} 🏆`;
                txtMensaje.style.color = "#d32f2f";
            }
            
            // Muestra el botón de reiniciar cuando el juego termina
            if (botonReiniciar) {
                botonReiniciar.style.display = "block";
            }
        }
    }, 1000);
}

// --- MOVIMIENTOS ---

function mover(direccion) {
    if (!juegoActivo) return;
    iniciarTemporizador(); // El juego empieza al moverte

    if (direccion === "arriba" && personajeY > 0) personajeY -= velocidad;
    if (direccion === "abajo" && personajeY < canvas.height - altoPersonaje) personajeY += velocidad;
    if (direccion === "izquierda" && personajeX > 0) locksmith: personajeX -= velocidad;
    if (direccion === "derecha" && personajeX < canvas.width - anchoPersonaje) personajeX += velocidad;

    verificarColision();
    dibujarJuego();
}

// --- FUNCIÓN REINICIAR ---

function reiniciarJuego() {
    // Frenamos el temporizador actual
    if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
    }
    
    // Restablecemos los estados e interfaz
    puntos = 0;
    tiempo = 10;
    juegoActivo = true;
    
    if (txtPuntos) txtPuntos.textContent = puntos;
    if (txtTiempo) txtTiempo.textContent = tiempo;
    
    if (txtMensaje) {
        txtMensaje.textContent = "Autor: MLxz y su amigo Ia";
        txtMensaje.style.color = "#ffd54f"; // Restablece color original
    }
    
    // Oculta el botón de nuevo al iniciar
    if (botonReiniciar) {
        botonReiniciar.style.display = "none"; 
    }
    
    // Posición inicial del personaje
    personajeX = 230;
    personajeY = 150;
    
    moverObjetivo();
    dibujarJuego();
    console.log("El juego se ha reiniciado. ¡A cazar!");
}

// --- CONTROLADORES DE EVENTOS ---

// Asignar el evento clic al botón de reiniciar de forma segura
if (botonReiniciar) {
    botonReiniciar.addEventListener('click', reiniciarJuego);
    // De entrada lo ocultamos para que solo aparezca al perder
    botonReiniciar.style.display = "none"; 
}

// Eventos del mouse/clic en los botones amarillos de la pantalla
const btnArriba = document.getElementById("arriba") || document.getElementById("btn-up");
const btnAbajo = document.getElementById("abajo") || document.getElementById("btn-down");
const btnIzquierda = document.getElementById("izquierda") || document.getElementById("btn-left");
const btnDerecha = document.getElementById("derecha") || document.getElementById("btn-right");

if (btnArriba) btnArriba.addEventListener("click", () => mover("arriba"));
if (btnAbajo) btnAbajo.addEventListener("click", () => mover("abajo"));
if (btnIzquierda) btnIzquierda.addEventListener("click", () => mover("izquierda"));
if (btnDerecha) btnDerecha.addEventListener("click", () => mover("derecha"));

// Eventos del Teclado
window.addEventListener("keydown", (evento) => {
    if (["ArrowUp", "KeyW"].includes(evento.key)) mover("arriba");
    if (["ArrowDown", "KeyS"].includes(evento.key)) mover("abajo");
    if (["ArrowLeft", "KeyA"].includes(evento.key)) mover("izquierda");
    if (["ArrowRight", "KeyD"].includes(evento.key)) mover("derecha");
});

// --- INICIALIZACIÓN INICIAL ---
moverObjetivo();
dibujarJuego();
