import { getDistance, getRhumbLineBearing } from "geolib";
import { roundAndTruncate } from "../library/lib";
import geomagnetism from "geomagnetism";
import { forward, toPoint } from "mgrs";

export type CoordinateFormat = "D.D" | "D M.M" | "D M S.S" | "MGRS";
export type Bullsey = [number, number]; //bearing, range

export class Coordinate {
  latitudeDecimal: number = 0;
  longitudeDecimal: number = 0;
  latitudeWhole: number = 0;
  longitudeWhole: number = 0;
  // To know how a coordinate was created if passed in a string, otherwise it is
  // not detected
  detected: CoordinateFormat | "Not Detected" = "Not Detected";

  /**
   * Create a coordinate by latitude and longitude
   * @param latitude Decimal latitude
   * @param longitude Decimal longitude
   */
  constructor(latitude: number, longitude: number);

  /**
   * Create a coordinate from a string in various formats:
   * - Decimal degrees (D.D): "N 34.56 W 117.83"
   * - Degrees and decimal minutes (D M.M): "N 34 33.6 W 117 49.8"
   * - Degrees, minutes, and decimal seconds (D M S.S): "N 34 33 36 W 117 49 48"
   * - MGRS: "11SNA 12345 67890"
   * @param coordinate String representation of a coordinate
   */
  constructor(coordinate: string);

  constructor(latOrString: number | string, longitude?: number) {
    // If passed a lat and lng as a number, create a new coordinate. It sets
    // the detected to Not Detected. Detected is for user input strings.
    if (typeof latOrString !== "string" && typeof longitude === "number") {
      if (latOrString > 90 || latOrString < -90 || longitude > 180 || longitude < -180)
        throw new Error("Not valid coordinates");
      this.latitudeWhole = Math.floor(Math.abs(latOrString));
      this.longitudeWhole = Math.floor(Math.abs(longitude));
      this.latitudeDecimal = latOrString % 1;
      this.longitudeDecimal = longitude % 1;
      if (latOrString < 0) this.latitudeWhole *= -1;
      if (longitude < 0) this.longitudeWhole *= -1;
      this.detected = "Not Detected";
      return;
    }
    
    if (typeof latOrString !== "string")
      throw new Error(`Pass a string or (latitude, longitude), passed ${latOrString}`);
    
    const coordinate = latOrString;

    // Check if the coordinate is MGRS format
    const mgrsRegex = /^[0-9]+[a-zA-Z]\s*[a-zA-Z]+\s*([0-9]\s*[0-9]\s*)+$/;
    if (mgrsRegex.test(coordinate)) {
      // Remove spaces
      let string = coordinate.replace(/\s/g, "");

      // Add missing zeros - needed for mgrs library
      const numbersArray = string.match(/([0-9]\s*[0-9]\s*)+$/);
      if (numbersArray && numbersArray.length > 0) {
        const stringLength = string.length;
        const mgrsLength = numbersArray[0].length / 2;
        for (let i = mgrsLength; i < 5; i++) {
          string = string.slice(0, stringLength - mgrsLength) + "0" + string.slice(stringLength - mgrsLength) + "0";
        }
      }

      const [lng, lat] = toPoint(string);
      this.latitudeWhole = Math.floor(Math.abs(lat));
      this.longitudeWhole = Math.floor(Math.abs(lng));
      this.latitudeDecimal = lat % 1;
      this.longitudeDecimal = lng % 1;
      if (lat < 0 && this.latitudeWhole > 0) this.latitudeWhole = this.latitudeWhole * -1;
      if (lng < 0 && this.longitudeWhole > 0) this.longitudeWhole = this.longitudeWhole * -1;
      if (this.latitudeWhole < 0 && this.longitudeWhole > 0) this.longitudeWhole = this.longitudeWhole * -1;
      if (this.longitudeWhole < 0 && this.longitudeDecimal > 0) this.longitudeDecimal = this.longitudeDecimal * -1;
      this.detected = "MGRS";
      return;
    }

    // This intentionally takes almost any format of coordinate. It errs to guessing over
    // wanting perfectly formatted coordinates. It searches for W or E in the string and
    // looks at the number of digits grouped together.
    const containsWest = coordinate.match(/[wW]+/) ? true : false;
    const containsSouth = coordinate.match(/[sS]+/) ? true : false;
    const parts = coordinate.match(/-?[0-9.]+/g);
    if (!parts) throw new Error("Not valid coordinates");
    const numbers = parts.map((part) => parseFloat(part));

    // The user must be passing in D.D with only two sets of numbers
    if (numbers.length === 2) {
      this.latitudeWhole = Math.floor(Math.abs(numbers[0]));
      this.longitudeWhole = Math.floor(Math.abs(numbers[1]));
      this.latitudeDecimal = numbers[0] % 1;
      this.longitudeDecimal = numbers[1] % 1;
      if ((containsSouth || numbers[0] < 0) && this.latitudeWhole > 0) this.latitudeWhole = this.latitudeWhole * -1;
      if ((containsWest || numbers[1] < 0) && this.longitudeWhole > 0) this.longitudeWhole = this.longitudeWhole * -1;
      if (this.latitudeWhole < 0 && this.latitudeDecimal > 0) this.latitudeDecimal = this.latitudeDecimal * -1;
      if (this.longitudeWhole < 0 && this.longitudeDecimal > 0) this.longitudeDecimal = this.longitudeDecimal * -1;
      this.detected = "D.D";

      // The user is passing in D M.M
    } else if (numbers.length === 4) {
      if (numbers[1] < 0 || numbers[3] < 0 || numbers[1] > 60 || numbers[3] > 60)
        throw new Error("Not valid coordinates");
      this.latitudeWhole = Math.floor(numbers[0]);
      this.longitudeWhole = Math.floor(numbers[2]);
      this.latitudeDecimal = numbers[1] / 60;
      this.longitudeDecimal = numbers[3] / 60;
      if ((containsSouth || numbers[0] < 0) && this.latitudeWhole > 0) this.latitudeWhole = this.latitudeWhole * -1;
      if ((containsWest || numbers[2] < 0) && this.longitudeWhole > 0) this.longitudeWhole = this.longitudeWhole * -1;
      if (this.latitudeWhole < 0 && this.latitudeDecimal > 0) this.latitudeDecimal = this.latitudeDecimal * -1;
      if (this.longitudeWhole < 0 && this.longitudeDecimal > 0) this.longitudeDecimal = this.longitudeDecimal * -1;
      this.detected = "D M.M";

      // The user is passing in D M S.S
    } else if (numbers.length === 6) {
      if (
        numbers[1] < 0 ||
        numbers[2] < 0 ||
        numbers[4] < 0 ||
        numbers[5] < 0 ||
        numbers[1] > 60 ||
        numbers[2] > 60 ||
        numbers[4] > 60 ||
        numbers[5] > 60
      )
        throw new Error("Not valid coordinates");
      this.latitudeWhole = Math.floor(numbers[0]);
      this.longitudeWhole = Math.floor(numbers[3]);
      this.latitudeDecimal = numbers[1] / 60 + numbers[2] / 3600;
      this.longitudeDecimal = numbers[4] / 60 + numbers[5] / 3600;
      if ((containsSouth || numbers[0] < 0) && this.latitudeWhole > 0) this.latitudeWhole = this.latitudeWhole * -1;
      if ((containsWest || numbers[3] < 0) && this.longitudeWhole > 0) this.longitudeWhole = this.longitudeWhole * -1;
      if (this.latitudeWhole < 0 && this.latitudeDecimal > 0) this.latitudeDecimal = this.latitudeDecimal * -1;
      if (this.longitudeWhole < 0 && this.longitudeDecimal > 0) this.longitudeDecimal = this.longitudeDecimal * -1;
      this.detected = "D M S.S";
    } else {
      throw new Error("Not valid coordinates");
    }

    if (this.latitudeWhole > 90 || this.latitudeWhole < -90 || this.longitudeWhole > 180 || this.longitudeWhole < -180)
      throw new Error("Not valid coordinates");
  }

  /**
   * Convert the coordinate to the specified format
   * @param format The desired output format
   * @param showTrailingZeros Whether to display trailing zeros in the output
   * @returns Formatted coordinate string
   */

  toFormat(format: CoordinateFormat, showTrailingZeros = false): string {
    switch (format) {
      case "D.D":
        return this.degreesDecimalDegrees(showTrailingZeros);
      case "D M.M":
        return this.degreesMinutesDecimalMinutes(showTrailingZeros);
      case "D M S.S":
        return this.degreesMinutesSecondsDecimalSeconds(showTrailingZeros);
      case "MGRS": {
        let value = forward(this.lngLatArray, 5);
        value = value.slice(0, 3) + " " + value.slice(3, 5) + " " + value.slice(5, 10) + " " + value.slice(10);
        return value;
      }
    }
  }

  get lngLatArray(): [number, number] {
    return [this.longitude, this.latitude];
  }

  get latLngArray(): [number, number] {
    return [this.latitude, this.longitude];
  }

  toLatLonObject(): { latitude: number; longitude: number } {
    return { latitude: this.latitude, longitude: this.longitude };
  }

  /**
   * Calculate the distance in meters from this coordinate to another point
   * @param point The reference coordinate
   * @returns Distance in meters
   */
  distanceFromPoint(point: Coordinate): number {
    return getDistance(point.lngLatArray, this.lngLatArray);
  }

  /**
   * Calculate the bearing from this coordinate to another point
   * @param point The reference coordinate
   * @returns Bearing in degrees
   */
  bearingFromPoint(point: Coordinate): number {
    return getRhumbLineBearing(point.lngLatArray, this.lngLatArray);
  }

  bullseye(bullseye: Coordinate, magnetic = true): Bullsey {
    return [
      this.bearingFromPoint(bullseye) + (magnetic ? this.magVar : 0),
      this.distanceFromPoint(bullseye) * 0.0005399565,
    ];
  }

  bullseyeText(bullseye: Coordinate, magnetic = true) {
    const pointBullseye = this.bullseye(bullseye, magnetic);
    return `${roundAndTruncate(pointBullseye[0], 0)}/${roundAndTruncate(pointBullseye[1], 0)}`;
  }

  get magVar() {
    return geomagnetism.model().point([this.latitude, this.longitude]).decl;
  }

  get latitude() {
    return this.latitudeWhole + this.latitudeDecimal;
  }

  get longitude() {
    return this.longitudeWhole + this.longitudeDecimal;
  }

  // Returns N 34.54 W 113.24
  /**
   * Format coordinate as decimal degrees (e.g., "N 34.56789 W 117.12345")
   * @param showTrailingZeros Whether to show trailing zeros in decimal part
   * @returns Formatted string in D.D format
   */
  degreesDecimalDegrees(showTrailingZeros = false) {
    const latDeg = Math.abs(this.latitudeWhole);
    const lngDeg = Math.abs(this.longitudeWhole);
    let latHemisphere = "N";
    let lngHemisphere = "E";
    if (this.latitudeWhole < 0) latHemisphere = "S";
    if (this.longitudeWhole < 0) lngHemisphere = "W";

    const latDecimalSplit = roundAndTruncate(this.latitudeDecimal, 6, 0, showTrailingZeros ? 6 : 0).split(".");
    let latDecimal = latDecimalSplit?.[1] ?? "";
    if (!latDecimal && showTrailingZeros) latDecimal = "000000";
    if (latDecimal) latDecimal = "." + latDecimal;

    const lngDecimalSplit = roundAndTruncate(this.longitudeDecimal, 6, 0, showTrailingZeros ? 6 : 0).split(".");
    let lngDecimal = lngDecimalSplit?.[1] ?? "";
    if (!lngDecimal && showTrailingZeros) lngDecimal = "000000";
    if (lngDecimal) lngDecimal = "." + lngDecimal;

    return `${latHemisphere} ${latDeg}${latDecimal} ` + `${lngHemisphere} ${lngDeg}${lngDecimal}`;
  }

  /**
   * Format coordinate as degrees and decimal minutes (e.g., "N 34 50.2 W 116 32.4")
   * @param showTrailingZeros Whether to show trailing zeros in decimal part
   * @returns Formatted string in D M.M format
   */
  degreesMinutesDecimalMinutes(showTrailingZeros = false) {
    const latMin = Math.abs(this.latitudeDecimal * 60);
    const lngMin = Math.abs(this.longitudeDecimal * 60);
    let latHemisphere = "N";
    let lngHemisphere = "E";
    if (this.latitude < 0) {
      latHemisphere = "S";
    }
    if (this.longitude < 0) {
      lngHemisphere = "W";
    }
    return (
      `${latHemisphere} ${Math.abs(this.latitudeWhole)} ${roundAndTruncate(latMin, 4, 0, showTrailingZeros ? 4 : 0)} ` +
      `${lngHemisphere} ${Math.abs(this.longitudeWhole)} ${roundAndTruncate(lngMin, 4, 0, showTrailingZeros ? 4 : 0)}`
    );
  }

  /**
   * Format coordinate as degrees, minutes, and decimal seconds
   * (e.g., "N 39 50 24.23 W 115 34 23.9")
   * @param showTrailingZeros Whether to show trailing zeros in decimal part
   * @returns Formatted string in D M S.S format
   */
  degreesMinutesSecondsDecimalSeconds(showTrailingZeros = false): string {
    const latMin = Math.abs(this.latitudeDecimal) * 60;
    const latMinFloor = Math.floor(latMin);
    const latSec = latMinFloor === 0 ? latMin * 60 : (latMin % latMinFloor) * 60;

    const lngMin = Math.abs(this.longitudeDecimal) * 60;
    const lngMinFloor = Math.floor(lngMin);
    const lngSec = lngMinFloor === 0 ? lngMin * 60 : (lngMin % lngMinFloor) * 60;
    let latHemisphere = "N";
    let lngHemisphere = "E";
    if (this.latitude < 0) {
      latHemisphere = "S";
    }
    if (this.longitude < 0) {
      lngHemisphere = "W";
    }
    return (
      `${latHemisphere} ${Math.abs(this.latitudeWhole)} ${roundAndTruncate(latMinFloor, 2, 0, showTrailingZeros ? 2 : 0)} ${roundAndTruncate(
        latSec,
        2,
        0,
        showTrailingZeros ? 2 : 0,
      )} ` +
      `${lngHemisphere} ${Math.abs(this.longitudeWhole)} ${roundAndTruncate(lngMinFloor, 2, 0, showTrailingZeros ? 2 : 0)} ${roundAndTruncate(
        lngSec,
        2,
        0,
        showTrailingZeros ? 2 : 0,
      )}`
    );
  }

  /**
   * Check if a string can be parsed as a valid coordinate
   * @param coordinate String to validate
   * @returns True if string can be parsed as a coordinate
   */
  public static isValidText(coordinate: string) {
    try {
      new Coordinate(coordinate);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the full descriptive text for a coordinate format
   * @param format The coordinate format code
   * @returns Human-readable description of the format
   */
  public static fullFormatText(format: CoordinateFormat) {
    switch (format) {
      case "D M S.S":
        return "Degrees Minutes Seconds";
      case "D M.M":
        return "Degrees Minutes";
      case "D.D":
        return "Degrees";
      case "MGRS":
        return "MGRS";
    }
  }

  /**
   * Get the precision level for a given coordinate format
   * @param format The coordinate format code
   * @returns The precision level as a string
   */
  public static getPrecision(format: CoordinateFormat) {
    switch (format) {
      case "D M S.S":
        return "0.308 meters";
      case "D M.M":
        return "0.185 meters";
      case "D.D":
        return "0.11 meters";
      case "MGRS":
        return "1 meter";
    }
  }
}

export default Coordinate;
