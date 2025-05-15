import { createEffect, createSignal, onCleanup, onMount, type Component } from "solid-js";
import { BottomBar } from "../BottomBar";
import { map as leafletMap, Map, tileLayer, polyline } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSettings } from "../../../context/settings";
import { copyToClipboard } from "../../../library/lib";
import Coordinate from "../../../models/coordinate";
import { addAirspaceGeoJson } from "./leaflet-lib";

const Leaflet: Component = () => {
  const [mouseCoordinate, setMouseCoordinate] = createSignal<Coordinate>();
  const [settings, setSettings] = useSettings()!;

  // eslint-disable-next-line prefer-const
  let mapDiv: HTMLDivElement | undefined = undefined;
  let map: Map | undefined = undefined;

  createEffect(() => {
    const array = settings.route.points.map((point) => {
      return point.coordinate.latLngArray;
    });

    if (!map) return;

    const line = polyline(array, { color: "red" }).addTo(map);
    // line.on("click", (e) => {
    //   line.removeFrom(map!);
    // });

    if (!map.getBounds().contains(line.getBounds())) {
      console.log("doesnt fit!");
      map.fitBounds(line.getBounds(), { maxZoom: 10 });
    }

    onCleanup(() => {
      if (map) line.removeFrom(map);
    });
  });

  onMount(() => {
    if (!mapDiv) return;

    map = leafletMap(mapDiv, { center: settings.startCenter.latLngArray, zoom: 8 });

    tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=${import.meta.env.VITE_MAPTILERKEY}`, {
      //style URL
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      crossOrigin: true,
    }).addTo(map);

    addAirspaceGeoJson(map);

    map!.on("mousemove", (e) => {
      setMouseCoordinate(new Coordinate(e.latlng.lat, e.latlng.lng));
    });

    map!.on("mouseup", (e) => {
      const coordinate = new Coordinate(e.latlng.lat, e.latlng.lng);
      copyToClipboard(coordinate.toFormat(settings.coordinateFormat));
    });

    map!.on("click", (e) => {});
  });

  return (
    <>
      <div class="w-full h-192">
        <div ref={mapDiv} class="p-0 m-0 w-full h-[calc(100%-2rem)] select-none"></div>

        <BottomBar mouseCoordinate={mouseCoordinate() ?? new Coordinate("N0 E0")}></BottomBar>
      </div>
    </>
  );
};

export { Leaflet };
