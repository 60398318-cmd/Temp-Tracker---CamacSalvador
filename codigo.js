// ========================================
// TEMPTRACKER
// Tu companero climatico
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

  mensaje.textContent = "🔄 Buscando información del clima...";

  try {
    // ========================================
    // URL DE WEATHERAPI
    // ========================================
    const apiClimaActual = `https://api.weatherapi.com/v1/current.json?q=${encodeURIComponent(ciudad)}&lang=${idioma}&key=${claveApi}`;

    const response = await fetch(apiClimaActual);

    // Si la API devuelve un error
    if (!response.ok) {
      throw new Error("No se pudo obtener la informacion.");
    }

    const data = await response.json();

    // WeatherAPI puede devolver un error
    // aunque HTTP sea correcto
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

    climaInfo.style.display = "none";
  }
}

// ========================================
// FUNCION MOSTRAR CLIMA
// ========================================

function mostrarClima(data) {
  // Mostrar el contenedor
  climaInfo.style.display = "block";

  // ========================================
  // UBICACION
  // ========================================

  ciudadElemento.textContent = data.location.name;

  paisElemento.textContent = `${data.location.region}, ${data.location.country}`;

  // ========================================
  // TEMPERATURA
  // ========================================

  temperaturaElemento.textContent = `${Math.round(data.current.temp_c)}°C`;

  // ========================================
  // CONDICION
  // ========================================

  condicionElemento.textContent = data.current.condition.text;

  // ========================================
  // ICONO
  // ========================================

  let icono = data.current.condition.icon;

  // WeatherAPI normalmente devuelve //cdn...
  // Lo convertimos en HTTPS

  if (icono.startsWith("//")) {
    icono = "https:" + icono;
  }

  iconoClima.src = icono;
  iconoClima.alt = data.current.condition.text;

  // ========================================
  // HUMEDAD
  // ========================================

  humedadElemento.textContent = `${data.current.humidity}%`;

  // ========================================
  // VIENTO
  // ========================================

  vientoElemento.textContent = `${data.current.wind_kph} km/h`;

  // ========================================
  // SENSACION TERMICA
  // ========================================

  sensacionElemento.textContent = `${Math.round(data.current.feelslike_c)}°C`;

  // ========================================
  // HORA
  // ========================================

  horaElemento.textContent = data.location.localtime;
}

// ========================================
// EVENTO DEL BOTON
// ========================================

botonBuscar.addEventListener("click", buscarClima);

// ========================================
// BUSCAR PRESIONANDO ENTER
// ========================================

inputCiudad.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    buscarClima();
  }
});

// ========================================
// CARGAR CLIMA INICIAL
// ========================================

window.addEventListener("load", function () {
  inputCiudad.value = "Huancayo";
  buscarClima();
});
