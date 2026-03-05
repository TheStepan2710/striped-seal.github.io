function getBandColor(level) {
  if (level >= 0.72) return 'rgba(204, 44, 44, 0.72)';
  if (level >= 0.46) return 'rgba(217, 131, 50, 0.68)';
  return 'rgba(214, 184, 47, 0.64)';
}

function drawFlowArrow(ctx, x, y, angle, scale) {
  const len = 24 * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-len * 0.55, -len * 0.45);
  ctx.bezierCurveTo(-len * 0.1, -len * 0.05, len * 0.05, len * 0.2, len * 0.48, len * 0.52);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(len * 0.48, len * 0.52);
  ctx.lineTo(len * 0.3, len * 0.45);
  ctx.moveTo(len * 0.48, len * 0.52);
  ctx.lineTo(len * 0.4, len * 0.33);
  ctx.stroke();
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
    if (!observations.length) return;

    const projected = observations.map((item) => ({
      ...item,
      point: map.latLngToContainerPoint([item.lat, item.lon]),
    }));

    const maxCount = Math.max(...projected.map((item) => item.count));
    const step = 8;
    const sigmaBase = 36;

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        let value = 0;
        projected.forEach((item) => {
          const norm = item.count / maxCount;
          const sigma = sigmaBase + norm * 34;
          const dx = x - item.point.x;
          const dy = y - item.point.y;
          const dist2 = dx * dx + dy * dy;
          value += norm * Math.exp(-dist2 / (2 * sigma * sigma));
        });

        if (value < 0.1) continue;
        const clamped = Math.min(1, value);
        ctx.fillStyle = getBandColor(clamped);
        ctx.fillRect(x, y, step, step);
      }
    }

    projected.forEach((item) => {
      const intensity = Math.max(0.4, item.count / maxCount);
      const angle = ((item.lat * 1.7 + item.lon) % 16 - 8) * (Math.PI / 180);
      drawFlowArrow(ctx, item.point.x, item.point.y, angle, 0.8 + intensity * 0.5);
      drawFlowArrow(ctx, item.point.x - 18, item.point.y + 10, angle, 0.62 + intensity * 0.35);
    });
  }

  return { draw, resize };
}
