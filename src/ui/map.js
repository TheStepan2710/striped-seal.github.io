export function initMap(containerId) {
  const map = L.map(containerId, {
    zoomControl: false,
    attributionControl: true,
  }).setView([55.5, 149.2], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    minZoom: 4,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  return map;
}

export function createMarkerLayer(map, onMarkerTap) {
  const markerLayer = L.layerGroup().addTo(map);

  function renderMarkers(observations) {
    markerLayer.clearLayers();
    observations.forEach((observation) => {
      const marker = L.circleMarker([observation.lat, observation.lon], {
        radius: 8,
        color: '#ffffff',
        fillColor: '#ffffff',
        fillOpacity: 0.9,
        weight: 2,
      });
      marker.on('click', () => onMarkerTap(observation));
      marker.addTo(markerLayer);
    });
  }

  return { renderMarkers };
}
