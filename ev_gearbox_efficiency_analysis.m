%% EV Gearbox Efficiency Analysis
% Edit these values to analyze a different operating point.
settings = struct( ...
    'wheelSpeed', 70, ...          % km/h
    'wheelTorque', 180, ...        % Nm
    'ratio', 8, ...
    'batteryPower', 60, ...        % kW
    'meshCoefficient', 0.018, ...
    'spinLoss', 450, ...           % W
    'oilTemperature', 70);        % deg C

point = operatingPoint(settings);
fprintf('Gearbox efficiency: %.1f%%\n', point.efficiency * 100);
fprintf('Total modeled loss: %.2f kW\n', point.totalLoss / 1000);
fprintf('Motor torque: %.1f Nm\n', point.motorTorque);
fprintf('Motor speed: %.0f rpm\n', point.motorSpeed);
fprintf('Estimated range energy penalty: %.1f%%\n', point.rangeEffect);
if point.powerLimited
    fprintf('Warning: estimated motor power exceeds the battery power limit.\n');
end

speedAxis = 10:10:160;
torqueAxis = 20:20:500;
efficiencyMap = efficiencyGrid(settings);
figure('Name', 'EV Gearbox Efficiency Map', 'Color', 'w');
contourf(torqueAxis, speedAxis, efficiencyMap, 20, 'LineColor', 'none');
colormap(parula(256));
caxis([0.55 0.995]);
colorbar('Ticks', 0.55:0.05:0.95, 'TickLabels', compose('%.0f%%', (0.55:0.05:0.95) * 100));
hold on;
plot(min(max(settings.wheelTorque, torqueAxis(1)), torqueAxis(end)), ...
    min(max(settings.wheelSpeed, speedAxis(1)), speedAxis(end)), ...
    'wo', 'MarkerFaceColor', 'w', 'MarkerEdgeColor', 'k', 'MarkerSize', 8);
hold off;
grid on;
xlabel('Wheel torque (Nm)');
ylabel('Vehicle speed (km/h)');
title('Gearbox efficiency map');
