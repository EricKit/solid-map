import { createSignal, onMount, type Component } from "solid-js";
import ArcGISMap from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import { BottomBar } from "./map/BottomBar";
import Coordinate from "../models/coordinate";

const Map: Component = () => {
  const [mouseCoordinate, setMouseCoordinate] = createSignal<Coordinate>();

  let view: MapView | undefined = undefined;

  const map = new ArcGISMap({
    basemap: "satellite",
  });

  let mapDiv;

  const color = "black";
  const moaSymbol = new SimpleFillSymbol({ style: "none", outline: { color } });
  const renderer = new SimpleRenderer({ symbol: moaSymbol });
  const layers = [
    new GeoJSONLayer({ url: "/geojson/Korea_LLZs.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/2NM_Buffer.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/Current_BMGR_May_2020.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/Korea_NFL.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/Low_MOAs.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/MOAs.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/New_BMGR.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/P_518_Border.geojson", geometryType: "polygon", renderer }),
    new GeoJSONLayer({ url: "/geojson/Restricted_Areas.geojson", renderer }),
    new GeoJSONLayer({ url: "/geojson/D35.geojson", renderer }),
  ];

  map.addMany(layers);

  onMount(() => {
    view = new MapView({
      map: map,
      container: mapDiv,
      zoom: 8,
      center: [-115.75, 37.25],
      ui: {
        components: ["attribution", "compass", "zoom"], //basemaplayerlist
      },
    });

    view.ui.move("zoom", "bottom-right");

    view.when(() => {
      console.log("Map is loaded");
    });
  });

  const xyToCoordinate = (x: number, y: number): Coordinate | undefined => {
    if (!view?.container) return;
    const yOffset = view.container.getBoundingClientRect().top + window.scrollY;
    const xOffset = view.container.getBoundingClientRect().left + window.scrollX;
    const point = view.toMap({ x: x - xOffset, y: y - yOffset });
    if (!point) return;
    try {
      return new Coordinate(point.latitude ?? 0, point.longitude ?? 0);
    } catch {
      console.log("Tried to throw");
      console.log("yOffset", yOffset);
      console.log("xOffset", xOffset);
      console.log("point", point);
    }
    return undefined;
  };

  const onMouseMove = (event: MouseEvent) => {
    const coordinate = xyToCoordinate(event.pageX, event.pageY);
    if (!coordinate) return;

    setMouseCoordinate(coordinate);

    // if (!drawing) return;
    // switch (drawing) {
    //   case "measure":
    //     onMouseMoveMeasure(coordinate);
    //     break;
    //   case "line": {
    //     onMouseMoveDrawLines(coordinate);
    //     break;
    //   }
    //   case "circle":
    //     onMouseMoveDrawCircles(coordinate);
    //     break;
    // }
  };

  return (
    <div class="w-full h-192">
      {/* <div ref={mapDiv} class="p-0 m-0 w-full h-[calc(100%-2rem)]" on:mousemove={onMouseMove}></div> */}
      <div ref={mapDiv} class="p-0 m-0 w-full h-[calc(100%-2rem)]">
        {" "}
      </div>

      <BottomBar mouseCoordinate={mouseCoordinate() ?? new Coordinate("N0 E0")}></BottomBar>
    </div>
  );
};

export { Map };
