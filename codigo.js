// ========================================
// TEMPTRACKER
// Tu compañero climático
// ========================================

// ========================================
// CONFIGURACION DE LA API
// ========================================

const claveApi = "b1f99d440b774737a04192425261709";
const idioma = "es";

// ========================================
// ELEMENTOS DEL HTML
// ========================================

const inputCiudad = document.getElementById("input-ciudad");
const botonBuscar = document.getElementById("btn-buscar");
const mensaje = document.getElementById("mensaje");
const climaInfo = document.getElementById("clima-info");

const ciudadElemento = document.getElementById("ciudad");
const paisElemento = document.getElementById("pais");
const temperaturaElemento = document.getElementById("temperatura");
const condicionElemento = document.getElementById("condicion");
const iconoClima = document.getElementById("icono-clima");
const humedadElemento = document.getElementById("humedad");
const vientoElemento = document.getElementById("viento");
const sensacionElemento = document.getElementById("sensacion");
const horaElemento = document.getElementById("hora");

// ========================================
// FUNCION PARA BUSCAR EL CLIMA
// ========================================

async function buscarClima() {
  const ciudad = inputCiudad.value.trim();

  // Comprobar que se haya escrito una ciudad
  if (ciudad === "") {
    mensaje.textContent = "⚠️ Escribe el nombre de una ciudad.";
    return;
  }

  // Comprobar que exista la API Key
  if (claveApi === "") {
    mensaje.textContent = "⚠️ Primero configura tu clave de WeatherAPI.";
    return;
  }

  mensaje.textContent = "🔄 Buscando informacion del clima...";

  try {
    // ========================================
    // URL DE WEATHERAPI (ORDEN CORRECTO DE PARAMETROS)
    // ========================================
    const apiClimaActual = `https://api.weatherapi.com/v1/current.json?key=${claveApi}&q=${encodeURIComponent(ciudad)}&lang=${idioma}`;

    const response = await fetch(apiClimaActual);

    // Si la API devuelve un error HTTP
    if (!response.ok) {
      throw new Error("No se pudo obtener la informacion.");
    }

    const data = await response.json();

    // WeatherAPI puede devolver un objeto de error interno
    if (data.error) {
      throw new Error(data.error.message);
    }

    // ========================================
    // MOSTRAR CLIMA
    // ========================================

    mostrarClima(data);

    mensaje.textContent = "";
  } catch (error) {
    console.error("Error:", error);

    mensaje.textContent = "❌ No se encontro la ciudad o ocurrio un error.";

    if (climaInfo) {
      climaInfo.style.display = "none";
    }
  }
}

// ========================================
// FUNCION MOSTRAR CLIMA
// ========================================

function mostrarClima(data) {
  // Mostrar el contenedor
  if (climaInfo) {
    climaInfo.style.display = "block";
  }

  // ========================================
  // UBICACION Y DATOS
  // ========================================

  if (ciudadElemento) ciudadElemento.textContent = data.location.name;
  if (paisElemento)
    paisElemento.textContent = `${data.location.region}, ${data.location.country}`;
  if (temperaturaElemento)
    temperaturaElemento.textContent = `${Math.round(data.current.temp_c)}°C`;
  if (condicionElemento)
    condicionElemento.textContent = data.current.condition.text;

  // ========================================
  // ICONO
  // ========================================

  if (iconoClima) {
    let icono = data.current.condition.icon;
    if (icono.startsWith("//")) {
      icono = "https:" + icono;
    }
    iconoClima.src = icono;
    iconoClima.alt = data.current.condition.text;
  }

  // ========================================
  // DETALLES ADICIONALES
  // ========================================

  if (humedadElemento)
    humedadElemento.textContent = `${data.current.humidity}%`;
  if (vientoElemento)
    vientoElemento.textContent = `${data.current.wind_kph} km/h`;
  if (sensacionElemento)
    sensacionElemento.textContent = `${Math.round(data.current.feelslike_c)}°C`;
  if (horaElemento) horaElemento.textContent = data.location.localtime;
}

// ========================================
// EVENTOS
// ========================================

if (botonBuscar) {
  botonBuscar.addEventListener("click", buscarClima);
}

if (inputCiudad) {
  inputCiudad.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      buscarClima();
    }
  });
}

// ========================================
// CARGAR CLIMA INICIAL
// ========================================

window.addEventListener("load", function () {
  if (inputCiudad) {
    inputCiudad.value = "Huancayo";
    buscarClima();
  }
});
