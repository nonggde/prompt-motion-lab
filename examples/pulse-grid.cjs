'use strict';

// 中文：一个 12 秒、24 方格的确定性 PULSE / GRID 实验。
// English: a deterministic 12-second PULSE / GRID experiment with 24 cells.
const Pulse = require('../src/pulse-scene.js');

module.exports = {
  duration: 12,
  width: Pulse.W,
  height: Pulse.H,
  render(ctx, t, config) {
    return Pulse.render(ctx, t, config);
  }
};
