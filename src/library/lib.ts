export function roundAndTruncate(
  number: number,
  maxFractionDigits: number,
  minNonFractionDigits = 0,
  minFractionDigits = 0,
) {
  // Round decimal
  const value = parseFloat(number.toFixed(maxFractionDigits)).toString();

  // Pad start
  const values = value.split(".");
  if (values.length > 0 && values[0].length < minNonFractionDigits) {
    values[0] = values[0].padStart(minNonFractionDigits, "0");
  }

  if (values.length > 1 && values[1].length < minFractionDigits) {
    values[1] = values[1].padEnd(minFractionDigits, "0");
  } else if (values.length === 1 && minFractionDigits !== 0) {
    values[1] = "".padEnd(minFractionDigits, "0");
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

export function knotsToUnit(knots: number, units: "mps"): number {
  if (units === "mps") {
    return knots * 0.514444;
  }
  throw "Should not be here";
}
