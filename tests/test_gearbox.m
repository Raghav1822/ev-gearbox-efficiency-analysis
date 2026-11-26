function tests = test_gearbox
%TEST_GEARBOX Tests for the EV gearbox efficiency model.
tests = functiontests(localfunctions);
end

function setupOnce(~)
root = fileparts(fileparts(mfilename('fullpath')));
addpath(root);
end

function testEfficiencyIsBounded(testCase)
inputs = struct('motorTorque', 25, 'motorSpeed', 3000, ...
    'meshCoefficient', 0.018, 'spinLoss', 450, 'oilTemperature', 70);
result = gearboxEfficiency(inputs);
verifyGreaterThanOrEqual(testCase, result.efficiency, 0.55);
verifyLessThanOrEqual(testCase, result.efficiency, 0.995);
verifyGreaterThan(testCase, result.totalLoss, 0);
end

function testOperatingPointScalesTorqueByRatio(testCase)
point = operatingPoint(nominalInputs());
verifyEqual(testCase, point.motorTorque, 22.5, 'AbsTol', 1e-9);
verifyGreaterThan(testCase, point.motorSpeed, 0);
end

function testEfficiencyGridDimensions(testCase)
inputs = nominalInputs();
map = efficiencyGrid(inputs);
verifySize(testCase, map, [16 25]);
end

function testHotterOilReducesCorrectedSpinLoss(testCase)
inputs = nominalInputs();
inputs.oilTemperature = 20;
cold = operatingPoint(inputs);
inputs.oilTemperature = 110;
hot = operatingPoint(inputs);
verifyGreaterThanOrEqual(testCase, hot.efficiency, cold.efficiency);
end

function inputs = nominalInputs()
inputs = struct('wheelSpeed', 70, 'wheelTorque', 180, 'ratio', 8, ...
    'batteryPower', 60, 'meshCoefficient', 0.018, 'spinLoss', 450, ...
    'oilTemperature', 70);
end
