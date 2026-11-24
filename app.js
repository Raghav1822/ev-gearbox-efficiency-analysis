import { operatingPoint, efficiencyGrid, clamp } from './gearbox.js';

const canvas = document.getElementById('efficiencyMap');
const ctx = canvas.getContext('2d');

const ui = {
  speed: document.getElementById('speed'), torque: document.getElementById('torque'),
  ratio: document.getElementById('ratio'), power: document.getElementById('power'),
  mesh: document.getElementById('mesh'), spin: document.getElementById('spin'),
  oil: document.getElementById('oil'),
  speedOut: document.getElementById('speedOut'), torqueOut: document.getElementById('torqueOut'),
  ratioOut: document.getElementById('ratioOut'), powerOut: document.getElementById('powerOut'),
  meshOut: document.getElementById('meshOut'), spinOut: document.getElementById('spinOut'),
  oilOut: document.getElementById('oilOut'),
  efficiency: document.getElementById('efficiency'), loss: document.getElementById('loss'),
  motorTorque: document.getElementById('motorTorque'), rangeEffect: document.getElementById('rangeEffect')
};

function value() {
  return {
    wheelSpeed: Number(ui.speed.value), wheelTorque: Number(ui.torque.value),
    ratio: Number(ui.ratio.value), batteryPower: Number(ui.power.value),
    meshCoefficient: Number(ui.mesh.value), spinLoss: Number(ui.spin.value),
    oilTemperature: Number(ui.oil.value)
  };
}

function sync() {
  ui.speedOut.textContent = ui.speed.value;
  ui.torqueOut.textContent = ui.torque.value;
  ui.ratioOut.textContent = Number(ui.ratio.value).toFixed(1);
  ui.powerOut.textContent = ui.power.value;
  ui.meshOut.textContent = Number(ui.mesh.value).toFixed(3);
  ui.spinOut.textContent = ui.spin.value;
  ui.oilOut.textContent = ui.oil.value;
  update();
}

function efficiencyColor(efficiency) {
  if (efficiency >= 0.96) return '#57e389';
  if (efficiency >= 0.92) return '#91d83b';
  if (efficiency >= 0.88) return '#ffd166';
  if (efficiency >= 0.82) return '#f49e4c';
  return '#df5a67';
}

function drawMap() {
  const inputs = value();
  const grid = efficiencyGrid(inputs);
  const left = 78, right = 828, top = 32, bottom = 462;
  const plotWidth = right - left, plotHeight = bottom - top;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#091522';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const speeds = 16, torques = 25;
  for (let s = 0; s < speeds; s++) {
    for (let t = 0; t < torques; t++) {
      const point = grid[s][t];
      const x = left + (t / (torques - 1)) * plotWidth;
      const y = bottom - (s / (speeds - 1)) * plotHeight;
      const cellW = plotWidth / (torques - 1) + 1;
      const cellH = plotHeight / (speeds - 1) + 1;
      ctx.fillStyle = efficiencyColor(point.efficiency);
      ctx.globalAlpha = 0.68;
      ctx.fillRect(x - cellW / 2, y - cellH / 2, cellW, cellH);
    }
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = 'rgba(220,238,248,.28)';
  ctx.fillStyle = '#b1c1cf';
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'center';
  for (let torque = 0; torque <= 500; torque += 100) {
    const x = left + torque / 500 * plotWidth;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.fillText(String(torque), x, bottom + 22);
  }
  ctx.textAlign = 'right';
  for (let speed = 20; speed <= 160; speed += 20) {
    const y = bottom - (speed - 10) / 150 * plotHeight;
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    ctx.fillText(String(speed), left - 10, y + 4);
  }
  ctx.fillStyle = '#edf5ff';
  ctx.textAlign = 'center';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText('Wheel torque (Nm)', (left + right) / 2, 505);
  ctx.save(); ctx.translate(20, (top + bottom) / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('Vehicle speed (km/h)', 0, 0); ctx.restore();

  const currentX = left + clamp(inputs.wheelTorque, 20, 500) / 500 * plotWidth;
  const currentY = bottom - (clamp(inputs.wheelSpeed, 10, 160) - 10) / 150 * plotHeight;
  ctx.beginPath(); ctx.arc(currentX, currentY, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.strokeStyle = '#07111d'; ctx.lineWidth = 3; ctx.stroke();
}

function update() {
  const point = operatingPoint(value());
  ui.efficiency.textContent = `${(point.efficiency * 100).toFixed(1)}%`;
  ui.loss.textContent = `${(point.totalLoss / 1000).toFixed(2)} kW`;
  ui.motorTorque.textContent = `${point.motorTorque.toFixed(1)} Nm`;
  ui.rangeEffect.textContent = point.powerLimited ? 'Battery limited' : `+${point.rangeEffect.toFixed(1)}% loss`;
  ui.efficiency.style.color = efficiencyColor(point.efficiency);
  drawMap();
}

[ui.speed, ui.torque, ui.ratio, ui.power, ui.mesh, ui.spin, ui.oil].forEach((input) => input.addEventListener('input', sync));
sync();
