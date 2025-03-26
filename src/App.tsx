import type { Component, JSX } from "solid-js";
import { Navbar } from "./components/Navbar";

const App: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
};

export default App;
