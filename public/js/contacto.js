// Ajusta las coordenadas y el zoom según tu ubicación preferida
var map = L.map('map').setView([-0.1576349, -78.4812249], 30);

// Añade una capa de OpenStreetMap al mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Añade un marcador en una ubicación específica con una dirección
L.marker([40.7128, -74.0060]).addTo(map)
    .bindPopup('¡Hola! Esta es la dirección que prefieras mostrar.');