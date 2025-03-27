export function roundAndTruncate(number: number, maxFractionDigits: number, minNonFractionDigits = 0) {
  const value = parseFloat(number.toFixed(maxFractionDigits)).toString();
  const values = value.split(".");
  if (values.length > 0 && values[0].length < minNonFractionDigits) {
    values[0] = values[0].padStart(minNonFractionDigits, "0");
  }
  return values.join(".");
}

export function timer(ms: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

export function copyToClipboard(text: string) {
  if (!document) return;
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.setAttribute("readonly", "");
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export type RenderingEngine = "firefox" | "seamonkey" | "ie" | "opera" | "safari" | "chrome" | "chromium" | "unknown";

export function getRenderingEngine() {
  if (typeof window !== "object") return;
  const userAgent = window && navigator.userAgent;
  if (!userAgent) return;
  let renderingEngine: RenderingEngine = "unknown";

  if (userAgent?.includes("Safari/")) renderingEngine = "safari";
  if (userAgent?.includes("Firefox/")) renderingEngine = "firefox";
  if (userAgent?.includes("Seamonkey/")) renderingEngine = "seamonkey";
  if (userAgent?.includes("Chrome/")) renderingEngine = "chrome";
  if (userAgent?.includes("Chromium/")) renderingEngine = "chromium";
  if (userAgent?.includes("Opera/")) renderingEngine = "opera";
  if (userAgent?.includes("OPR/")) renderingEngine = "opera";
  if (userAgent?.includes("MSIE")) renderingEngine = "ie";
  if (userAgent?.includes("Trident/")) renderingEngine = "ie";

  return renderingEngine;
}

export const checkNumberString = (string: string) => {
  if (/^[0-9]*[.]?[0-9]*$/.test(string)) {
    return true;
  }
  return false;
};

const P0 = 101325;
//const T0 = 288.15;
const a0 = 340.29;
const rho0 = 1.225; // All SI units

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

  // i defines the array position that I require for the calc
  const alts = altitudeArray[i];
  const presRels = presRelsArray[i];
  const temps = tempsArray[i];
  const tempGrad = tempGradArray[i] / 1000;

  const deltaAlt = altSI - alts;
  const stdTemp = temps + deltaAlt * tempGrad; // this is the standard temperature at STP

  const tempSI = stdTemp + tempRaw; // includes the temp offset
  const tempDegC = tempSI - 273.15;
  //const roundTSI = Math.round(sigFig * tempSI) / sigFig;
  const roundTDeg = Math.round(sigFig * tempDegC) / sigFig;

  // Now for the relative pressure calc:

  //define constants
  const airMol = 28.9644;
  const rhoSL = 1.225; // kg/m3
  const pSL = 101325; // Pa
  const tSL = 288.15; // K
  const gamma = 1.4;
  const g = 9.80665; // m/s2
  //const stdTempGrad = -0.0065; // deg K/m
  const rGas = 8.31432; //kg/Mol/K
  const R = 287.053;
  const gMR = (g * airMol) / rGas;
  //const dryMM = 0.0289644; //kg/mol
  //const adLapse = 0.00198; //K/ft

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

export function casCalc(speed: number, altitude: number, tempDelta: number) {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const cas = velFactor * speed;

  const qc = P0 * (Math.pow((Math.pow(cas / a0, 2) + 5) / 5, 7 / 2) - 1);

  const mach = Math.pow(5 * (Math.pow(qc / pressureSI + 1, 2 / 7) - 1), 0.5);
  const tas = mach * sonicSI;

  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);

  return { eas: eas * 1.94384, tas: tas * 1.94384, mach, temperature };
}

export function easCalc(speed: number, altitude: number, tempDelta: number) {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const eas = velFactor * speed;
  const tas = eas * Math.pow(rho0 / rhoSI, 0.5);
  const mach = tas / sonicSI;

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { cas: cas * 1.94384, tas: tas * 1.94384, mach, temperature };
}

export function tasCalc(speed: number, altitude: number, tempDelta: number) {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const velFactor = 0.514444444;

  const tas = velFactor * speed;
  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);
  const mach = tas / sonicSI;

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { cas: cas * 1.94384, eas: eas * 1.94384, mach, temperature };
}

export function machCalc(speed: number, altitude: number, tempDelta: number) {
  const { sonicSI, pressureSI, rhoSI, temperature } = atmCalc(altitude, tempDelta);

  const mach = speed;
  const tas = mach * sonicSI;
  const eas = tas / Math.pow(rho0 / rhoSI, 0.5);

  const qc = pressureSI * (Math.pow(1 + 0.2 * Math.pow(mach, 2), 7 / 2) - 1);
  const cas = a0 * Math.pow(5 * (Math.pow(qc / P0 + 1, 2 / 7) - 1), 0.5);

  return { cas: cas * 1.94384, eas: eas * 1.94384, tas: tas * 1.94384, temperature };
}

export function metersToUnits(meters: number, units: "ft" | "m"): { value: number; unit: "ft" | "m" | "km" | "nm" } {
  if (units === "ft") {
    const nm = meters / 1852;
    if (nm >= 1) {
      return { value: nm, unit: "nm" };
    } else {
      return { value: meters * 3.28084, unit: "ft" };
    }
  } else {
    if (meters > 1000) {
      const km = meters / 1000;
      return { value: km, unit: "km" };
    } else {
      return { value: meters, unit: "m" };
    }
  }
}

export function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;
  let error: string;
  const suspender = promise.then(
    (worked: T) => {
      status = "success";
      result = worked;
    },
    (errorString: string) => {
      status = "error";
      error = errorString;
    },
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw error;
      } else if (status === "success") {
        return result;
      }

      throw suspender;
    },
  };
}
