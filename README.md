# ev-gearbox-efficiency-analysis

[![Live demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-50d8e7)](https://raghav1822.github.io/ev-gearbox-efficiency-analysis/)
[![Tests](https://img.shields.io/badge/Tests-node:test-91d83b)](./tests/gearbox.test.mjs)

An interactive electric vehicle drivetrain analysis project covering gearbox efficiency, mesh and spin losses, thermal correction, torque scaling, battery power limits, and range penalty estimation.

## Live demo

Open: **https://raghav1822.github.io/ev-gearbox-efficiency-analysis/**

Adjust vehicle speed, wheel torque, gear ratio, battery power, mesh coefficient, spin loss, and oil temperature. The dashboard updates the operating-point metrics and efficiency map.

## Engineering model

- Wheel torque is reduced by the transmission ratio to obtain motor torque.
- Wheel power is computed from torque and angular speed.
- Gear-mesh loss is proportional to motor power and the calibrated mesh coefficient.
- Bearing and spin losses include a simple oil-temperature correction.
- Gearbox efficiency is calculated from useful output power and total drivetrain loss.
- Range effect estimates the percentage energy penalty associated with gearbox loss.

## Run locally

```bash
npm test
npm run serve
```

Then open `http://localhost:8080`.

## Validation

The unit suite verifies efficiency bounds, torque-ratio scaling, the efficiency-map dimensions, and thermal correction behavior.

## License

MIT
