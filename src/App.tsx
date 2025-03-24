import type { Component } from "solid-js";
import { Map } from "./components/Map";
import { ConvertCoordinate } from "./components/ConvertCoordinate";
import { Card } from "./components/Card";
import { PageTemplate } from "./components/PageTemplate";

const App: Component = () => {
  return (
    <PageTemplate headerText="Target Imagery Generator" class="container">
      <Card headerText="Convert Coordinates" class="mb-4">
        <ConvertCoordinate></ConvertCoordinate>
      </Card>
      <Map></Map>
    </PageTemplate>
  );
};

export default App;
