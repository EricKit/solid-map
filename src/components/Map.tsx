import { createSignal, onMount, type Component } from "solid-js";

import { BottomBar } from "./map/BottomBar";
import Coordinate from "../models/coordinate";
import { Map as LibreMap, NavigationControl, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "../styles/maptilersat.json";
import { useSettings } from "../context/settings";
import { copyToClipboard } from "../library/lib";

const Map: Component = () => {
  const [mouseCoordinate, setMouseCoordinate] = createSignal<Coordinate>();
  const [settings, setSettings] = useSettings()!;

  // eslint-disable-next-line prefer-const
  let mapDiv: HTMLDivElement | undefined = undefined;
  let map: LibreMap | undefined = undefined;

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

    map = new LibreMap({
      container: mapDiv, // container id
      style: mapStyle as StyleSpecification,
      center: settings.startCenter.lngLatArray,
      zoom: 7, // starting zoom
      canvasContextAttributes: { powerPreference: "low-power", desynchronized: true },
    });

    map.addControl(
      new NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true,
      }),
    );

    // const geoNames = [
    //   "Korea_LLZs",
    //   "2NM_Buffer",
    //   "Current_BMGR_May_2020",
    //   "Korea_NFL",
    //   "Low_MOAs",
    //   "MOAs",
    //   "New_BMGR",
    //   "P_518_Border",
    //   "Restricted_Areas",
    //   "D35",
    // ];

    map.on("load", () => {
      // geoNames.forEach((geoName) => {
      //   map!.addSource(geoName, { type: "geojson", data: `/geojson/${geoName}.geojson` });
      //   map!.addLayer({
      //     id: geoName,
      //     type: "line",
      //     source: geoName,
      //     layout: {
      //       "line-join": "round",
      //       "line-cap": "round",
      //     },
      //     paint: {
      //       "line-color": "#000",
      //       "line-width": 2,
      //     },
      //   });
      // });
      // const styleJson = map.getStyle();
      // console.log(styleJson);
      map!.on("mousemove", (e) => {
        setMouseCoordinate(new Coordinate(e.lngLat.lat, e.lngLat.lng));
      });

      map!.on("mouseup", (e) => {
        const coordinate = new Coordinate(e.lngLat.lat, e.lngLat.lng);

        copyToClipboard(coordinate.toFormat(settings.coordinateFormat));
      });

      map!.on("click", (e) => {});
    });
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

export { Map };
