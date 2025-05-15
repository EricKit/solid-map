import { Component, useContext, createContext, JSX } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import Coordinate, { CoordinateFormat } from "../models/coordinate";
import { Route } from "../models/route";

type Settings = {
  coordinateFormat: CoordinateFormat;
  startCenter: Coordinate;
  bullseye: Coordinate;
  route: Route;
};

const SettingsContext = createContext<[Settings, SetStoreFunction<Settings>]>();

const SettingsProvider: Component<{ children: JSX.Element }> = (props) => {
  const [settings, setSettings] = createStore<Settings>({
    coordinateFormat: "D M.M",
    startCenter: new Coordinate(44.8, 13),
    bullseye: new Coordinate(44.8, 13),
    route: new Route(),
  });

  return <SettingsContext.Provider value={[settings, setSettings]}>{props.children}</SettingsContext.Provider>;
};

export { SettingsProvider };

export function useSettings() {
  return useContext(SettingsContext);
}
