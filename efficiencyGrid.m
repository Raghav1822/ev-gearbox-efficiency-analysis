function efficiencyMap = efficiencyGrid(inputs)
%EFFICIENCYGRID Generate efficiency values over speed and wheel-torque ranges.
speedAxis = 10:10:160;
torqueAxis = 20:20:500;
efficiencyMap = zeros(numel(speedAxis), numel(torqueAxis));
for speedIndex = 1:numel(speedAxis)
    for torqueIndex = 1:numel(torqueAxis)
        pointInputs = inputs;
        pointInputs.wheelSpeed = speedAxis(speedIndex);
        pointInputs.wheelTorque = torqueAxis(torqueIndex);
        pointInputs.batteryPower = 150;
        point = operatingPoint(pointInputs);
        efficiencyMap(speedIndex, torqueIndex) = point.efficiency;
    end
end
end
