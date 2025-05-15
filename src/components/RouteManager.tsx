import { createSignal, Show, type Component } from "solid-js";

import { useSettings } from "../context/settings";
import { RouteTable } from "./RouteTable";
import { RouteInput } from "./RouteInput";
import { Route, RoutePoint } from "../models/route";

const RouteManager: Component<{ point?: RoutePoint }> = () => {
  const [settings, setSettings] = useSettings()!;
  const [editPoint, setEditPoint] = createSignal<number | undefined>(settings.route.points?.length > 0 ? undefined : 0);

  function pointAdded(point: RoutePoint) {
    const route = new Route();
    route.points = [...settings.route.points];

    if (editPoint() !== undefined) {
      route.points[editPoint()!] = point;
    } else {
      route.points.push(point);
    }

    setSettings("route", route);
    setEditPoint(undefined);
  }

  return (
    <>
      EditPoint: {editPoint()}
      <Show when={settings.route.points.length > 0 && editPoint() !== 0}>
        <RouteTable
          edit={(index) => setEditPoint(index)}
          end={editPoint() === undefined ? undefined : editPoint()! - 1}
        ></RouteTable>
      </Show>
      <Show when={!(editPoint() === undefined)}>
        <RouteInput
          onSubmit={pointAdded}
          index={editPoint()!}
          point={editPoint() === undefined ? undefined : settings.route.points[editPoint()!]}
        ></RouteInput>
      </Show>
      <Show when={editPoint() !== undefined && editPoint()! < settings.route.points.length}>
        <RouteTable
          edit={(index) => setEditPoint(index)}
          start={editPoint() === undefined ? undefined : editPoint()! + 1}
          showLabels={false}
        ></RouteTable>
      </Show>
    </>
  );
};

export { RouteManager };
