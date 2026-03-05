function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getRampColor(t, alpha = 1) {
  const normalized = clamp(t, 0, 1);
  if (normalized < 0.5) {
    const mid = Math.round(255 - 110 * (normalized * 2));
    return `rgba(255, ${mid}, 0, ${alpha})`;
  }
  const low = Math.round(145 - 145 * ((normalized - 0.5) * 2));
  return `rgba(255, ${low}, 0, ${alpha})`;
}

function drawBlob(ctx, x, y, radiusX, radiusY, angle) {
  const k = 0.65;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, -radiusY);
  ctx.bezierCurveTo(radiusX * k, -radiusY, radiusX, -radiusY * k, radiusX, 0);
  ctx.bezierCurveTo(radiusX, radiusY * k, radiusX * 0.45, radiusY, 0, radiusY * 0.9);
  ctx.bezierCurveTo(-radiusX * 0.45, radiusY, -radiusX, radiusY * k, -radiusX, 0);
  ctx.bezierCurveTo(-radiusX, -radiusY * k, -radiusX * k, -radiusY, 0, -radiusY);
  ctx.closePath();
  ctx.restore();
}

function drawFlowArrows(ctx, x, y, radiusX, radiusY, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(255,255,255,0.78)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  const lines = [-radiusX * 0.3, 0, radiusX * 0.28];
  lines.forEach((offset) => {
    ctx.beginPath();
    ctx.moveTo(offset - 3, -radiusY * 0.7);
    ctx.bezierCurveTo(offset + 10, -radiusY * 0.2, offset + 4, radiusY * 0.25, offset + 14, radiusY * 0.62);
    ctx.stroke();

    const tipX = offset + 14;
    const tipY = radiusY * 0.62;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - 8, tipY - 4);
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - 5, tipY - 10);
    ctx.stroke();
  });
  ctx.restore();
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
      const radiusX = 36 + intensity * 62;
      const radiusY = 58 + intensity * 98;
      const direction = ((observation.lon + observation.lat) % 20 - 10) * (Math.PI / 180);

      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        8,
        point.x,
        point.y,
        Math.max(radiusX, radiusY),
      );
      gradient.addColorStop(0, getRampColor(intensity, 0.58));
      gradient.addColorStop(0.45, getRampColor(Math.max(0.2, intensity * 0.75), 0.5));
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.fillStyle = gradient;
      drawBlob(ctx, point.x, point.y, radiusX, radiusY, direction);
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = getRampColor(Math.min(1, intensity + 0.2), 0.75);
      drawBlob(ctx, point.x, point.y, radiusX, radiusY, direction);
      ctx.stroke();

      drawFlowArrows(ctx, point.x, point.y, radiusX, radiusY, direction);
    });
  }

  return { draw, resize };
}
