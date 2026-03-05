function getRampColor(t) {
  if (t < 0.5) {
    return `rgba(255, ${Math.round(255 - 110 * (t * 2))}, 0, 1)`;
  }
  return `rgba(255, ${Math.round(145 - 145 * ((t - 0.5) * 2))}, 0, 1)`;
}

export function createHeatmapOverlay(canvas, map) {
  const ctx = canvas.getContext('2d');

  function resize() {
    const size = map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
  }

  function draw(observations) {
    resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!observations.length) {
      return;
    }

    const maxCount = Math.max(...observations.map((item) => item.count));
    observations.forEach((observation) => {
      const point = map.latLngToContainerPoint([observation.lat, observation.lon]);
      const intensity = Math.max(0.15, observation.count / maxCount);
      const radius = 28 + intensity * 50;
      const gradient = ctx.createRadialGradient(point.x, point.y, 4, point.x, point.y, radius);
      gradient.addColorStop(0, getRampColor(intensity));
      gradient.addColorStop(0.4, getRampColor(intensity * 0.75));
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.globalAlpha = 0.25 + intensity * 0.45;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  return { draw, resize };
}
