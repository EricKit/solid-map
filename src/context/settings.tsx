import { Component, useContext, createContext, JSX } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import Coordinate, { CoordinateFormat } from "../models/coordinate";

type Settings = {
  coordinateFormat: CoordinateFormat;
  startCenter: Coordinate;
  bullseye: Coordinate;
};

const SettingsContext = createContext<[Settings, SetStoreFunction<Settings>]>();

const SettingsProvider: Component<{ children: JSX.Element }> = (props) => {
  const [settings, setSettings] = createStore<Settings>({
    coordinateFormat: "D M.M",
    startCenter: new Coordinate(44.8, 13),
    bullseye: new Coordinate(44.8, 13),
  });

  return <SettingsContext.Provider value={[settings, setSettings]}>{props.children}</SettingsContext.Provider>;
};

export { SettingsProvider };

export function useSettings() {
  return useContext(SettingsContext);
}
