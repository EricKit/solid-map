/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
import App from "./App";
import { Tools } from "./Tools";
import { ConvertCoordinate } from "./components/ConvertCoordinate";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Tools} />
      <Route path="/test" component={ConvertCoordinate} />
    </Router>
  ),
  root!,
);
