// Obtener el canvas y su contexto ---
const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

// Elementos del HTML para la interfaz
const txtPuntos = document.getElementById("puntos");
const txtTiempo = document.getElementById("tiempo");
const txtMensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById('btn-reiniciar');

// Definición de Variables (inicializadas en 0) ---
let gatoX = 0;
let gatoY = 0;
let comidaX = 0;
let comidaY = 0;

// Variables de control del estado del juego
let puntos = 0;
let tiempo = 10;
let juegoActivo = true;
let temporizador = null;
const velocidad = 15;
const ANCHO_GATO = 40;
const ALTO_GATO = 40;
const ANCHO_COMIDA = 24; 
const ALTO_COMIDA = 24;

// Función genérica encargada de dibujar cualquier rectángulo ---
function graficarRectangulo(x, y, ancho, alto, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, ancho, alto);
}

// Función modificada para graficar el gato
function graficarGato() {
    // Cuerpo del gato (Cazador Amarillo)
    graficarRectangulo(gatoX, gatoY, ANCHO_GATO, ALTO_GATO, "gold");

    // Ojos del gato
    graficarRectangulo(gatoX + 8, gatoY + 10, 6, 6, "black");
    graficarRectangulo(gatoX + 26, gatoY + 10, 6, 6, "black");

    // Sonrisa del gato
    ctx.beginPath();
    ctx.arc(gatoX + 20, gatoY + 23, 10, 0, Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// graficar la comida 
function graficarComida() {
    // Comida (Cuadrado verde brillante con borde)
    graficarRectangulo(comidaX, comidaY, ANCHO_COMIDA, ALTO_COMIDA, "#4caf50");
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1b5e20";
    ctx.strokeRect(comidaX, comidaY, ANCHO_COMIDA, ALTO_COMIDA);
}

// --- FUNCIÓN PRINCIPAL DE DIBUJO ---
function dibujarJuego() {
    // Limpiar pantalla antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Renderizar los elementos
    graficarComida();
    graficarGato();
}

// --- LÓGICA Y REGLAS ---

function moverComidaAleatoria() {
    // Coloca la comida en una posición al azar sin salirse de los límites del lienzo
    comidaX = Math.floor(Math.random() * (canvas.width - ANCHO_COMIDA));
    comidaY = Math.floor(Math.random() * (canvas.height - ALTO_COMIDA));
}

function verificarColision() {
    // Caja de colisión matemática por bordes entre el Gato y la Comida
    if (gatoX + ANCHO_GATO >= comidaX &&
        gatoX <= comidaX + ANCHO_COMIDA &&
        gatoY + ALTO_GATO >= comidaY &&
        gatoY <= comidaY + ALTO_COMIDA) {
        
        puntos++;
        if (txtPuntos) txtPuntos.textContent = puntos;
        if (txtMensaje) txtMensaje.textContent = "¡Cazado! 🎯";
        moverComidaAleatoria();
    }
}

function iniciarTemporizador() {
    if (temporizador) return; 

    temporizador = setInterval(() => {
        tiempo--;
        if (txtTiempo) txtTiempo.textContent = tiempo;

        if (tiempo <= 0) {
            clearInterval(temporizador);
            temporizador = null;
            juegoActivo = false;
            
            if (txtMensaje) {
                txtMensaje.textContent = `¡Tiempo agotado! Final: ${puntos} 🏆`;
                txtMensaje.style.color = "#d32f2f";
            }
            if (botonReiniciar) botonReiniciar.style.display = "block";
        }
    }, 1000);
}

function mover(direccion) {
    if (!juegoActivo) return;
    iniciarTemporizador(); 

    if (direccion === "arriba" && gatoY > 0) gatoY -= velocidad;
    if (direccion === "abajo" && gatoY < canvas.height - ALTO_GATO) gatoY += velocidad;
    if (direccion === "izquierda" && gatoX > 0) gatoX -= velocidad;
    if (direccion === "derecha" && gatoX < canvas.width - ANCHO_GATO) gatoX += velocidad;

    verificarColision();
    dibujarJuego();
}

//  Iniciar Juego asignando posiciones requeridas ---
function iniciarJuego() {
    puntos = 0;
    tiempo = 10;
    juegoActivo = true;

    // El gato aparece centrado en el canvas
    gatoX = (canvas.width / 2) - (ANCHO_GATO / 2);
    gatoY = (canvas.height / 2) - (ALTO_GATO / 2);

    // La comida aparece inicialmente en la esquina inferior derecha
    comidaX = canvas.width - ANCHO_COMIDA - 10;
    comidaY = canvas.height - ALTO_COMIDA - 10;

    // Actualizar marcadores e interfaz
    if (txtPuntos) txtPuntos.textContent = puntos;
    if (txtTiempo) txtTiempo.textContent = tiempo;
    if (txtMensaje) {
        txtMensaje.textContent = "Autor: MLxz y su amigo Ia";
        txtMensaje.style.color = "#ffd54f"; 
    }
    if (botonReiniciar) botonReiniciar.style.display = "none"; 

    // Dibujar el inicio
    dibujarJuego();
}

// --- ENLACES Y LISTENERS ---
if (botonReiniciar) botonReiniciar.addEventListener('click', iniciarJuego);

const btnArriba = document.getElementById("arriba");
const btnAbajo = document.getElementById("abajo");
const btnIzquierda = document.getElementById("izquierda");
const btnDerecha = document.getElementById("derecha");

if (btnArriba) btnArriba.addEventListener("click", () => mover("arriba"));
if (btnAbajo) btnAbajo.addEventListener("click", () => mover("abajo"));
if (btnIzquierda) btnIzquierda.addEventListener("click", () => mover("izquierda"));
if (btnDerecha) btnDerecha.addEventListener("click", () => mover("derecha"));

window.addEventListener("keydown", (evento) => {
    if (["ArrowUp", "KeyW"].includes(evento.key)) mover("arriba");
    if (["ArrowDown", "KeyS"].includes(evento.key)) mover("abajo");
    if (["ArrowLeft", "KeyA"].includes(evento.key)) mover("izquierda");
    if (["ArrowRight", "KeyD"].includes(evento.key)) mover("derecha");
});
