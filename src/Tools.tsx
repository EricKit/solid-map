import { ConvertCoordinate } from "./components/ConvertCoordinate";
import { Card } from "./components/Card";
import { Component } from "solid-js";
import { PageTemplate } from "./components/PageTemplate";
import { Leaflet } from "./components/map/leaflet/Leaflet";
import { RouteManager } from "./components/RouteManager";

const Tools: Component = () => {
  return (
    <>
      <PageTemplate headerText="Planning Tools" class="container">
        <Card headerText="Manage Route" class="mt-4">
          <RouteManager></RouteManager>
        </Card>

        <Leaflet></Leaflet>
        <Card headerText="Convert Coordinates" class="mt-4">
          <ConvertCoordinate></ConvertCoordinate>
        </Card>
      </PageTemplate>
    </>
  );
};

export { Tools };
