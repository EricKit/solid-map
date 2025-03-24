import { onMount, type Component } from "solid-js";
import ArcGISMap from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";

const Map: Component = () => {
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
    const view = new MapView({
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

  return (
    <div class="w-full h-192">
      <div ref={mapDiv} class="p-0 m-0 size-full"></div>
    </div>
  );
};

export { Map };
