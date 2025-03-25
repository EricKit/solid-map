import type { Component } from "solid-js";
import { Map } from "./components/Map";
import { ConvertCoordinate } from "./components/ConvertCoordinate";
import { Card } from "./components/Card";
import { PageTemplate } from "./components/PageTemplate";
import { Navbar } from "./components/Navbar";

const App: Component = () => {
  return (
    <>
      <Navbar />

      <PageTemplate headerText="Planning Tools" class="container">
        <Card headerText="Convert Coordinates" class="mb-4">
          <ConvertCoordinate></ConvertCoordinate>
        </Card>
        <Map></Map>
      </PageTemplate>
    </>
  );
};

export default App;
