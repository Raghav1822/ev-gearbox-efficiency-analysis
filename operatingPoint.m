function result = operatingPoint(inputs)
%OPERATINGPOINT Calculate drivetrain quantities at one vehicle operating point.
wheelRadius = 0.32;
wheelOmega = inputs.wheelSpeed / 3.6 / wheelRadius;
motorSpeed = wheelOmega * inputs.ratio * 60 / (2 * pi);
motorTorque = inputs.wheelTorque / inputs.ratio;
wheelPower = inputs.wheelTorque * wheelOmega;
losses = gearboxEfficiency(struct( ...
    'motorTorque', motorTorque, ...
    'motorSpeed', motorSpeed, ...
    'meshCoefficient', inputs.meshCoefficient, ...
    'spinLoss', inputs.spinLoss, ...
    'oilTemperature', inputs.oilTemperature));
motorPower = max(wheelPower / losses.efficiency, 0);
batteryLimitedPower = inputs.batteryPower * 1000;
powerLimited = motorPower > batteryLimitedPower;
rangeEffect = (1 / losses.efficiency - 1) * 100;
result = losses;
result.motorSpeed = motorSpeed;
result.motorTorque = motorTorque;
result.wheelPower = wheelPower;
result.motorPower = motorPower;
result.batteryLimitedPower = batteryLimitedPower;
result.powerLimited = powerLimited;
result.rangeEffect = rangeEffect;
end
