import { roundAndTruncate } from "../library/lib";

type Format = "M" | "T" | "C";
type AirspeedValues = { cas: number; tas: number; mach: number; eas: number; temperature: number };

const P0 = 101325;
// const T0 = 288.15;
const a0 = 340.29;
const rho0 = 1.225;

const sigFig = 1000;

function atmCalc(altitude: number, tempDelta: number) {
  const altRaw = altitude;
  const tempRaw = tempDelta;

  const altSI = altRaw * 0.3048;

  const altitudeArray = [0, 11000, 20000, 32000, 47000, 51000, 71000, 84852];
  const presRelsArray = [
    1, 2.23361105092158e-1, 5.403295010784876e-2, 8.566678359291667e-3, 1.094560133777114e-3, 6.606353132858367e-4,
    3.904683373343926e-5, 3.6850095235747942e-6,
  ];
  const tempsArray = [288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65, 186.946];
  const tempGradArray = [-6.5, 0, 1, 2.8, 0, -2.8, -2, 0];

  let i = 0;
  while (altSI > altitudeArray[i + 1]) {
    i = i + 1;
  }

  const alts = altitudeArray[i];
  const presRels = presRelsArray[i];
  const temps = tempsArray[i];
  const tempGrad = tempGradArray[i] / 1000;

  const deltaAlt = altSI - alts;
  const stdTemp = temps + deltaAlt * tempGrad;

  const tempSI = stdTemp + tempRaw;
  const tempDegC = tempSI - 273.15;
  // const roundTSI = Math.round(sigFig * tempSI) / sigFig;
  const roundTDeg = Math.round(sigFig * tempDegC) / sigFig;

  const airMol = 28.9644;
  const rhoSL = 1.225; // kg/m3
  const pSL = 101325; // Pa
  const tSL = 288.15; //K
  const gamma = 1.4;
  const g = 9.80665; // m/s2
  // const stdTempGrad = -0.0065; // deg K/m
  const rGas = 8.31432; //kg/Mol/K
  const R = 287.053;
  const gMR = (g * airMol) / rGas;
  // const dryMM = 0.0289644; //kg/mol
  // const adLapse = 0.00198; //K/ft

  let relPres: number;

  if (Math.abs(tempGrad) < 1e-10) {
    relPres = presRels * Math.exp((-1 * gMR * deltaAlt) / 1000 / temps);
  } else {
    relPres = presRels * Math.pow(temps / stdTemp, gMR / tempGrad / 1000);
  }

  // Now I can calculate the results:

  const sonicSI = Math.sqrt(gamma * R * tempSI);
  const pressureSI = pSL * relPres;
  const rhoSI = rhoSL * relPres * (tSL / tempSI);
  const sigma = rhoSI / rhoSL;

  return { tempSI, sonicSI, pressureSI, rhoSI, sigma, temperature: roundTDeg };
} // end atmCalc()

function casCalc(speed: number, altitude: number, tempDelta = 0): AirspeedValues {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const cas = velFactor * speed;

  const qc = P0 * (Math.pow((Math.pow(cas / a0, 2) + 5) / 5, 7 / 2) - 1);

  const mach = Math.pow(5 * (Math.pow(qc / pressureSI + 1, 2 / 7) - 1), 0.5);
  const tas = mach * sonicSI;

  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);

  return { cas, eas: eas * 1.94384, tas: tas * 1.94384, mach, temperature };
}

function easCalc(speed: number, altitude: number, tempDelta = 0): AirspeedValues {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const eas = velFactor * speed;
  const tas = eas * Math.pow(rho0 / rhoSI, 0.5);
  const mach = tas / sonicSI;

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { eas, cas: cas * 1.94384, tas: tas * 1.94384, mach, temperature };
}

function tasCalc(speed: number, altitude: number, tempDelta = 0): AirspeedValues {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const tas = velFactor * speed;
  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);
  const mach = tas / sonicSI;

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { tas, cas: cas * 1.94384, eas: eas * 1.94384, mach, temperature };
}

function machCalc(speed: number, altitude: number, tempDelta = 0): AirspeedValues {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const mach = speed;
  const tas = mach * sonicSI;
  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { mach, cas: cas * 1.94384, eas: eas * 1.94384, tas: tas * 1.94384, temperature };
}

export class Airspeed {
  private _true: number;
  private _altitude: number;
  private _format: Format;

  constructor(speedText: string, altitude: number) {
    this._altitude = altitude;

    const isValid = Airspeed.IsValid(speedText);

    if (!isValid.valid) {
      throw new Error(isValid.message);
    }

    if (speedText.match(/^.*[Mm].*$/)) {
      this._format = "M";
    } else if (speedText.match(/^.*[cC].*$/)) {
      this._format = "C";
    } else this._format = "T";

    const speed: number = parseFloat(speedText);

    let airspeedValues: AirspeedValues;

    if (this._format === "C") {
      airspeedValues = casCalc(speed, altitude);
    } else if (this._format === "T") {
      airspeedValues = tasCalc(speed, altitude);
    } else {
      airspeedValues = machCalc(speed, altitude);
    }

    this._true = airspeedValues.tas;
  }

  get calibrated(): number {
    return tasCalc(this._true, this._altitude).cas;
  }

  get mach(): number {
    return tasCalc(this._true, this._altitude).mach;
  }

  get true(): number {
    return this._true;
  }

  get format(): Format {
    return this._format;
  }

  get altitude(): number {
    return this._altitude;
  }

  get speedInFormat(): string {
    if (this.format === "M") return roundAndTruncate(this.mach, 2, 0, 2) + "M";
    if (this.format === "T") return roundAndTruncate(this.true, 0) + "T";
    return roundAndTruncate(this.calibrated, 0) + "C";
  }

  update(speedText: string, altitude: number): void {
    const newSpeed = new Airspeed(speedText, altitude);
    this._true = newSpeed.true;
    this._altitude = newSpeed._altitude;
  }

  public static IsValid(val: string): { valid: boolean; message?: string } {
    if (!/^\d*\.?\d*\s*[MCTmct]\s*$/.test(val)) return { valid: false, message: "Speed must in M, C, or T" };
    const speed = parseFloat(val);
    if (speed <= 0.001) return { valid: false, message: "Go faster" };
    if (speed > 10000) return { valid: false, message: "Too fast!" };
    return { valid: true };
  }
}
