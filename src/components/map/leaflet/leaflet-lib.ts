import { GeoJsonObject } from "geojson";
import { geoJSON, Map } from "leaflet";
import D35 from "../../../assets/geojson/D35.json";
import buffer from "../../../assets/geojson/2NM_Buffer.json";
import bmgr from "../../../assets/geojson/Current_BMGR_May_2020.json";
import llz from "../../../assets/geojson/Korea_LLZs.json";
import nfl from "../../../assets/geojson/Korea_NFL.json";
import lir10 from "../../../assets/geojson/LIR10.json";
import lowmoa from "../../../assets/geojson/Low_MOAs.json";
import moa from "../../../assets/geojson/MOAs.json";
import p518 from "../../../assets/geojson/P_518_Border.json";
import restricted from "../../../assets/geojson/Restricted_Areas.json";
import sara from "../../../assets/geojson/Sara.json";
import warning from "../../../assets/geojson/Warning_Areas.json";
import zita from "../../../assets/geojson/Zita.json";

const addAirspaceGeoJson = (map: Map) => {
  geoJSON(D35 as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(buffer as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(bmgr as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(llz as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(nfl as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(lowmoa as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(moa as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(p518 as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(restricted as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(sara as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(warning as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(zita as GeoJsonObject, { style: { color: "#FFF", weight: 1 } }).addTo(map);
  geoJSON(lir10 as GeoJsonObject, { style: { color: "#990000", weight: 1 } }).addTo(map);
};

export { addAirspaceGeoJson };
