import { createSignal, onMount, type Component } from "solid-js";

import { BottomBar } from "./map/BottomBar";
import Coordinate from "../models/coordinate";

import { map as leafletMap, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import maptilerStyle from "../styles/maptilersat.json";

import { useSettings } from "../context/settings";
import { copyToClipboard } from "../library/lib";

const Leaflet: Component = () => {
  const [mouseCoordinate, setMouseCoordinate] = createSignal<Coordinate>();
  const [settings, setSettings] = useSettings()!;

  // eslint-disable-next-line prefer-const
  let mapDiv: HTMLDivElement | undefined = undefined;
  let map: Map | undefined = undefined;

  // const color = "black";
  // const moaSymbol = new SimpleFillSymbol({ style: "none", outline: { color } });
  // const renderer = new SimpleRenderer({ symbol: moaSymbol });
  // const layers = [
  //   new GeoJSONLayer({ url: "/geojson/Korea_LLZs.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/2NM_Buffer.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/Current_BMGR_May_2020.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/Korea_NFL.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/Low_MOAs.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/MOAs.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/New_BMGR.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/P_518_Border.geojson", geometryType: "polygon", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/Restricted_Areas.geojson", renderer }),
  //   new GeoJSONLayer({ url: "/geojson/D35.geojson", renderer }),
  // ];

  // map.addMany(layers);

  onMount(() => {
    if (!mapDiv) return;

    map = leafletMap(mapDiv, { center: settings.startCenter.latLngArray, zoom: 8 });

    const mtLayer = new MaptilerLayer({
      style: maptilerStyle as never,
      apiKey: "tIvBavM5TIO7t5U84YFJ",
    }).addTo(map);
    console.log("map made");

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
        <div ref={mapDiv} class="p-0 m-0 w-full h-[calc(100%-2rem)]"></div>

        <BottomBar mouseCoordinate={mouseCoordinate() ?? new Coordinate("N0 E0")}></BottomBar>
      </div>
    </>
  );
};

export { Leaflet };
