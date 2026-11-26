export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function gearboxEfficiency({ motorTorque, motorSpeed, meshCoefficient, spinLoss, oilTemperature }) {
  const torque = Math.max(0, motorTorque);
  const speed = Math.max(0, motorSpeed);
  const thermalFactor = Math.pow(70 / Math.max(oilTemperature, 20), 0.12);
  const bearingLoss = (12 + 0.018 * speed) * thermalFactor;
  const mechanicalLoss = (12 + 0.018 * speed) * thermalFactor;
  const correctedSpin = spinLoss * thermalFactor;
  const outputPower = torque * speed * 2 * Math.PI / 60;
  const meshLoss = meshCoefficient * outputPower;
  const totalLoss = correctedSpin + mechanicalLoss + meshLoss + bearingLoss * 0.35;
  const efficiency = outputPower <= 0 ? 0 : clamp(outputPower / (outputPower + totalLoss), 0.55, 0.995);
  return { efficiency, totalLoss, outputPower, meshLoss, spinLoss: correctedSpin };
}

export function operatingPoint({ wheelSpeed, wheelTorque, ratio, batteryPower, meshCoefficient, spinLoss, oilTemperature }) {
  const wheelRadius = 0.32;
  const wheelOmega = wheelSpeed / 3.6 / wheelRadius;
  const motorSpeed = wheelOmega * ratio * 60 / (2 * Math.PI);
  const motorTorque = wheelTorque / ratio;
  const wheelPower = wheelTorque * wheelOmega;
  const result = gearboxEfficiency({ motorTorque, motorSpeed, meshCoefficient, spinLoss, oilTemperature });
  const motorPower = Math.max(wheelPower / result.efficiency, 0);
  const batteryLimitedPower = batteryPower * 1000;
  const powerLimited = motorPower > batteryLimitedPower;
  const rangeEffect = (1 / result.efficiency - 1) * 100;
  return {
    ...result,
    motorSpeed,
    motorTorque,
    wheelPower,
    motorPower,
    batteryLimitedPower,
    powerLimited,
    rangeEffect
  };
}

export function efficiencyGrid({ ratio, meshCoefficient, spinLoss, oilTemperature }) {
  const speeds = Array.from({ length: 16 }, (_, index) => 10 + index * 10);
  const torques = Array.from({ length: 25 }, (_, index) => 20 + index * 20);
  return speeds.map((speed) => torques.map((torque) => {
    const point = operatingPoint({
      wheelSpeed: speed,
      wheelTorque: torque,
      ratio,
      batteryPower: 150,
      meshCoefficient,
      spinLoss,
      oilTemperature
    });
    return { speed, torque, efficiency: point.efficiency };
  }));
}
