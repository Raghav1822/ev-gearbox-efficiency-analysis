import test from 'node:test';
import assert from 'node:assert/strict';
import { gearboxEfficiency, operatingPoint, efficiencyGrid } from '../gearbox.js';

test('gearbox efficiency is bounded', () => {
  const result = gearboxEfficiency({
    motorTorque: 25,
    motorSpeed: 3000,
    meshCoefficient: 0.018,
    spinLoss: 450,
    oilTemperature: 70
  });
  assert.ok(result.efficiency >= 0.55 && result.efficiency <= 0.995);
  assert.ok(result.totalLoss > 0);
});

test('operating point scales torque by gearbox ratio', () => {
  const point = operatingPoint({
    wheelSpeed: 70,
    wheelTorque: 180,
    ratio: 8,
    batteryPower: 60,
    meshCoefficient: 0.018,
    spinLoss: 450,
    oilTemperature: 70
  });
  assert.ok(Math.abs(point.motorTorque - 22.5) < 1e-9);
  assert.ok(point.motorSpeed > 0);
});

test('efficiency grid has 16 speed rows and 25 torque columns', () => {
  const grid = efficiencyGrid({
    ratio: 8,
    meshCoefficient: 0.018,
    spinLoss: 450,
    oilTemperature: 70
  });
  assert.equal(grid.length, 16);
  assert.ok(grid.every((row) => row.length === 25));
});

test('higher oil temperature reduces corrected spin loss at nominal temperature reference', () => {
  const cold = operatingPoint({
    wheelSpeed: 70, wheelTorque: 180, ratio: 8, batteryPower: 60,
    meshCoefficient: 0.018, spinLoss: 450, oilTemperature: 20
  });
  const hot = operatingPoint({
    wheelSpeed: 70, wheelTorque: 180, ratio: 8, batteryPower: 60,
    meshCoefficient: 0.018, spinLoss: 450, oilTemperature: 110
  });
  assert.ok(hot.efficiency >= cold.efficiency);
});
