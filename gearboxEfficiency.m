function result = gearboxEfficiency(inputs)
%GEARBOXEFFICIENCY Estimate gearbox output efficiency and modeled losses.
torque = max(0, inputs.motorTorque);
speed = max(0, inputs.motorSpeed);
thermalFactor = (70 / max(inputs.oilTemperature, 20)) ^ 0.12;
bearingLoss = (12 + 0.018 * speed) * thermalFactor;
mechanicalLoss = (12 + 0.018 * speed) * thermalFactor;
correctedSpin = inputs.spinLoss * thermalFactor;
outputPower = torque * speed * 2 * pi / 60;
meshLoss = inputs.meshCoefficient * outputPower;
totalLoss = correctedSpin + mechanicalLoss + meshLoss + bearingLoss * 0.35;
if outputPower <= 0
    efficiency = 0;
else
    efficiency = min(max(outputPower / (outputPower + totalLoss), 0.55), 0.995);
end
result = struct( ...
    'efficiency', efficiency, ...
    'totalLoss', totalLoss, ...
    'outputPower', outputPower, ...
    'meshLoss', meshLoss, ...
    'spinLoss', correctedSpin);
end
