import { ConvertCoordinate } from "./components/ConvertCoordinate";
import { Card } from "./components/Card";
import { Component } from "solid-js";
import { PageTemplate } from "./components/PageTemplate";
import { Leaflet } from "./components/map/leaflet/Leaflet";

const Tools: Component = () => {
  return (
    <>
      <PageTemplate headerText="Planning Tools" class="container">
        <Card headerText="Convert Coordinates" class="mb-4">
          <ConvertCoordinate></ConvertCoordinate>
        </Card>
        <Leaflet></Leaflet>
      </PageTemplate>
    </>
  );
};

export { Tools };
