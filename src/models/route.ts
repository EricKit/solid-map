import { knotsToUnit, metersToUnits, roundAndTruncate } from "../library/lib";
import { Airspeed } from "../models/airspeed";
import Coordinate from "./coordinate";

export type RoutePoint = {
  coordinate: Coordinate;
  airspeed?: Airspeed;
};

export class Route {
  points: RoutePoint[];

  constructor() {
    this.points = [];
  }

  legMilSecToPoint(index: number): number {
    if (index === 0) return 0;
    const distance = this.legMetersToPoint(index);
    const rate = knotsToUnit(this.points[index].airspeed!.true, "mps");
    if (rate <= 0) throw new Error("Tried to calculate timing with a negative or zero airspeed");

    return (distance / rate) * 1000;
  }

  legMetersToPoint(index: number): number {
    if (index === 0) return 0;
    if (index > this.points.length - 1) throw Error("Tried to access index above last point on route");
    return this.points[index].coordinate.distanceFromPoint(this.points[index - 1].coordinate);
  }

  legDistTextToPoint(index: number, unit: "ft" | "m"): string {
    const dist = metersToUnits(this.legMetersToPoint(index), unit);
    return `${roundAndTruncate(dist.value, 1)} ${dist.unit}`;
  }

  legTimeTextToPoint(index: number): string {
    const timeSec = Math.round(this.legMilSecToPoint(index) / 1000);
    const seconds = timeSec % 60;
    const timeMin = (timeSec - seconds) / 60;
    const minutes = timeMin % 60;
    const hours = (timeMin - minutes) / 60;

    const mmss = roundAndTruncate(minutes, 0, 2) + ":" + roundAndTruncate(seconds, 0, 2);
    if (hours === 0) return mmss;
    return roundAndTruncate(hours, 0, 2) + ":" + mmss;
  }

  totMilSecToPoint(index: number): number {
    if (index === 0) return 0;
    let totalTime = 0;
    for (let i = 1; i <= index; i++) {
      const distance = this.legMetersToPoint(i);
      const rate = knotsToUnit(this.points[i].airspeed!.true, "mps");
      totalTime += (distance / rate) * 1000;
    }

    return totalTime;
  }

  totMetersToPoint(index: number): number {
    if (index === 0) return 0;
    let totalDist = 0;
    for (let i = 1; i <= index; i++) {
      totalDist += this.legMetersToPoint(i);
    }

    return totalDist;
  }

  totDistTextToPoint(index: number, unit: "ft" | "m"): string {
    const dist = metersToUnits(this.totMetersToPoint(index), unit);
    return `${roundAndTruncate(dist.value, 1)} ${dist.unit}`;
  }

  totTimeTextToPoint(index: number): string {
    const timeSec = Math.round(this.totMilSecToPoint(index) / 1000);
    const seconds = timeSec % 60;
    const timeMin = (timeSec - seconds) / 60;
    const minutes = timeMin % 60;
    const hours = (timeMin - minutes) / 60;

    const mmss = roundAndTruncate(minutes, 0, 2) + ":" + roundAndTruncate(seconds, 0, 2);
    if (hours === 0) return mmss;
    return roundAndTruncate(hours, 0, 2) + ":" + mmss;
  }
}
