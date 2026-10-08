(function(global) {
  'use strict';

  const W = 1920;
  const H = 1080;
  const TAU = Math.PI * 2;
  const C = {
    ink: '#191918',
    paper: '#efede5',
    orange: '#f16b46',
    dim: '#85847b',
    line: '#cfccc1',
    soft: '#e2dfd4'
  };

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = value => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const out = value => 1 - Math.pow(1 - clamp(value), 4);

  function text(ctx, value, x, y, size, color, font = 'Anton', align = 'left') {
    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(value, x, y);
  }

  function label(ctx, value, x, y, color = C.dim, align = 'left', size = 22) {
    text(ctx, value, x, y, size, color, 'monospace', align);
  }

  function line(ctx, x1, y1, x2, y2, color, width = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function square(ctx, x, y, size, color, rotation = 0, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  function reveal(ctx, value, x, y, width, height, t, delay, color) {
    const progress = out((t - delay) / 0.7);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - 8, y - height - 18, width + 16, height + 26);
    ctx.clip();
    ctx.font = `200px Anton`;
    const measured = Math.max(1, ctx.measureText(value).width);
    ctx.translate(x, y + (1 - progress) * (height + 48));
    ctx.scale(width / measured, height / 200);
    text(ctx, value, 0, 0, 200, color);
    ctx.restore();
  }

  function footer(ctx, t) {
    line(ctx, 82, 995, 1838, 995, C.line, 1);
    line(ctx, 82, 995, 82 + 1756 * clamp(t / 12), 995, C.orange, 3);
    label(ctx, 'A SMALL SYSTEM WITH A BIG RHYTHM', 82, 1043, C.dim, 'left', 20);
    label(ctx, `${t.toFixed(2).padStart(5, '0')} / 12.00`, 1838, 1043, C.ink, 'right', 20);
  }

  // Six columns by four rows: the complete scene always contains exactly 24 cells.
  function cells() {
    const result = [];
    const cols = 6;
    const rows = 4;
    const cellSize = 76;
    const gap = 34;
    const originX = 1060;
    const originY = 314;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        result.push({
          row,
          col,
          x: originX + col * (cellSize + gap),
          y: originY + row * (cellSize + gap)
        });
      }
    }
    return { result, cellSize, gap, originX, originY, cols, rows };
  }

  const GRID = cells();

  function drawGrid(ctx, t) {
    const intro = ease((t - 0.6) / 1.3);
    const rowPhase = clamp((t - 2.1) / 2.7);
    const colPhase = clamp((t - 4.8) / 2.7);
    const settle = ease((t - 8.1) / 3.2);
    const pulseTime = Math.max(0, t - 2.1);
    const pulseStrength = 1 - settle * 0.86;

    ctx.save();
    ctx.globalAlpha = 0.5 * intro;
    for (let row = 0; row < GRID.rows; row += 1) {
      const y = GRID.originY + row * (GRID.cellSize + GRID.gap);
      line(ctx, GRID.originX - 45, y, GRID.originX + 5 * (GRID.cellSize + GRID.gap) + 45, y, C.line, 1);
    }
    for (let col = 0; col < GRID.cols; col += 1) {
      const x = GRID.originX + col * (GRID.cellSize + GRID.gap);
      line(ctx, x, GRID.originY - 45, x, GRID.originY + 3 * (GRID.cellSize + GRID.gap) + 45, C.line, 1);
    }
    ctx.restore();

    for (const cell of GRID.result) {
      const rowWave = Math.sin((pulseTime * 5.1) - cell.row * 0.95) * 0.5 + 0.5;
      const colWave = Math.sin((pulseTime * 4.7) - cell.col * 0.9 + 1.4) * 0.5 + 0.5;
      const rowWeight = clamp((rowPhase - cell.row * 0.045) * 1.2);
      const colWeight = clamp((colPhase - cell.col * 0.045) * 1.2);
      const wave = Math.max(rowWave * rowWeight, colWave * colWeight * 0.88);
      const ripple = wave * pulseStrength;
      const launch = out((t - 1.0 - (cell.row + cell.col) * 0.035) / 0.65);
      const finalX = cell.x;
      const finalY = cell.y;
      const driftX = Math.sin(pulseTime * 2.4 + cell.row * 0.8) * 15 * ripple * (1 - settle);
      const driftY = Math.cos(pulseTime * 2.1 + cell.col * 0.7) * 13 * ripple * (1 - settle);
      const x = mix(cell.x - 42 * (1 - launch), finalX, settle) + driftX;
      const y = mix(cell.y + 28 * (1 - launch), finalY, settle) + driftY;
      const size = mix(14, GRID.cellSize + 14 * ripple, launch) * mix(0.9, 1, settle);
      const angle = (1 - settle) * (0.28 * Math.sin(pulseTime * 2 + cell.col) + 0.08 * (cell.row - 1.5));
      const color = ripple > 0.62 ? C.orange : C.ink;
      const alpha = mix(0.18, 1, launch) * mix(0.58, 1, intro);
      square(ctx, x, y, size, color, angle, alpha);
      if (ripple > 0.72 && settle < 0.75) {
        ctx.beginPath();
        ctx.arc(x, y, size * (0.75 + ripple * 0.55), 0, TAU);
        ctx.strokeStyle = C.orange;
        ctx.lineWidth = 2;
        ctx.globalAlpha = (ripple - 0.7) * 1.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    // A quiet baseline remains visible beneath the pulses, making the final alignment legible.
    if (settle > 0.03) {
      ctx.globalAlpha = settle * 0.42;
      for (const cell of GRID.result) {
        square(ctx, cell.x, cell.y, GRID.cellSize, C.ink, 0, 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  function render(ctx, t, config = {}) {
    const time = clamp(Number.isFinite(t) ? t : 0, 0, 12);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, H);

    // The title and grid share one persistent canvas; stage changes are eased rather than cut.
    label(ctx, 'PULSE / GRID', 82, 69, C.ink);
    label(ctx, '03 — EXPERIMENT', 1838, 69, C.ink, 'right');
    reveal(ctx, 'PULSE', 82, 392, 700, 230, time, 0, C.ink);
    reveal(ctx, 'BECOMES', 82, 620, 910, 170, time, 0.17, C.dim);
    reveal(ctx, 'PATTERN.', 82, 862, 980, 230, time, 0.34, C.orange);
    label(ctx, time < 2.1 ? '24 CELLS / ONE STARTING SIGNAL' : time < 4.8 ? 'ROW BY ROW / A SIGNAL TRAVELS' : time < 8.1 ? 'COLUMN BY COLUMN / THE GRID RESPONDS' : 'EVERYTHING RETURNS TO ALIGNMENT', 84, 925, C.dim, 'left', 20);
    drawGrid(ctx, time);
    footer(ctx, time);
    ctx.restore();
    return { time, width: W, height: H, cells: 24, config };
  }

  const api = { W, H, C, GRID, render };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.MotionPulse = api;
})(globalThis);
