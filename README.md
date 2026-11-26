# EV Gearbox Efficiency Analysis

An interactive electric-vehicle drivetrain analysis implemented in MATLAB. The model estimates gearbox efficiency, mesh and spin losses, oil-temperature correction, motor torque, battery power limits, and range impact.

## Run the analysis

Open MATLAB in the repository folder and run:

```matlab
ev_gearbox_efficiency_analysis
```

Edit the `settings` structure near the top of `ev_gearbox_efficiency_analysis.m` to change vehicle speed, wheel torque, gear ratio, battery power, mesh coefficient, spin loss, or oil temperature. The script prints operating-point metrics and plots the efficiency map with the selected operating point.

## Run tests

From the repository folder, run:

```matlab
results = runtests('tests');
disp(results);
```

The tests cover efficiency bounds, torque scaling, efficiency-map dimensions, and thermal correction behavior.

## Engineering model

- Motor speed is calculated from wheel speed, wheel radius, and gear ratio.
- Motor torque is wheel torque divided by the gear ratio.
- Gear-mesh loss is proportional to motor output power and the mesh coefficient.
- Bearing and spin losses use a simple oil-temperature correction referenced to 70 °C.
- Gearbox efficiency is useful output power divided by output power plus modeled losses.
- Range impact estimates the percentage energy penalty associated with gearbox loss.

This is a simplified engineering model for analysis and comparison, not a validated vehicle performance prediction.

## License

MIT
