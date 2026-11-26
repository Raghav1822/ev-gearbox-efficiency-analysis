# EV Gearbox Efficiency Analysis

An interactive electric-vehicle drivetrain analysis with a GitHub Pages dashboard and a MATLAB implementation. Explore gearbox efficiency, mesh and spin losses, oil-temperature correction, torque scaling, battery power limits, and estimated range impact.

## Live website

The existing GitHub Pages site is configured to publish the repository root from `main`. Once this change is merged and GitHub Pages finishes rebuilding, open: **https://raghav1822.github.io/ev-gearbox-efficiency-analysis/**

The dashboard runs in the browser with no server-side dependencies. Adjust the controls to update the operating-point metrics and efficiency map.

## Run the website locally

```bash
npm test
npm run serve
```

Then open `http://localhost:8080`.

## Run the MATLAB analysis

Open MATLAB in the repository folder and run:

```matlab
ev_gearbox_efficiency_analysis
```

Edit the `settings` structure near the top of `ev_gearbox_efficiency_analysis.m` to change the operating point. The script prints metrics and plots the efficiency map.

Run the MATLAB test suite with:

```matlab
results = runtests('tests');
disp(results);
```

The tests cover efficiency bounds, torque scaling, map dimensions, and thermal correction behavior.

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
