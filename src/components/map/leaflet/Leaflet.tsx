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
  const [settings] = useSettings()!;

  // eslint-disable-next-line prefer-const
  let mapDiv: HTMLDivElement | undefined = undefined;
  let map: Map | undefined = undefined;

  createEffect(() => {
    const array = settings.route.points.map((point) => {
      return point.coordinate.latLngArray;
    });

    if (!map) return;

    const line = polyline(array, { color: "red" }).addTo(map);
    // Uncomment if you want to allow removing lines by clicking
    // line.on("click", () => {
    //   line.removeFrom(map!);
    // });

    const MAX_ZOOM_LEVEL = 10;
    
    if (!map.getBounds().contains(line.getBounds())) {
      map.fitBounds(line.getBounds(), { maxZoom: MAX_ZOOM_LEVEL });
    }

    onCleanup(() => {
      if (map) line.removeFrom(map);
    });
  });

  onMount(() => {
    if (!mapDiv) return;

    map = leafletMap(mapDiv, { center: settings.startCenter.latLngArray, zoom: 8 });

    const mapTilerKey = import.meta.env.VITE_MAPTILERKEY;
    if (!mapTilerKey) {
      console.warn("MapTiler API key is missing. Map may not display correctly.");
    }
    
    tileLayer(`https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=${mapTilerKey || ''}`, {
      // style URL
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      attribution:
        '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
      crossOrigin: true,
    }).addTo(map);

    addAirspaceGeoJson(map);

    // Use optional chaining for safer access to the map object
    map?.on("mousemove", (e) => {
      setMouseCoordinate(new Coordinate(e.latlng.lat, e.latlng.lng));
    });

    map?.on("mouseup", (e) => {
      const coordinate = new Coordinate(e.latlng.lat, e.latlng.lng);
      copyToClipboard(coordinate.toFormat(settings.coordinateFormat));
    });

    map!.on("click", () => {
      // Click handler for future functionality
    });
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
