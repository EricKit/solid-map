import type { Component, JSX } from "solid-js";
import { Navbar } from "./components/Navbar";
import { SettingsProvider } from "./context/settings";

const App: Component<{ children?: JSX.Element }> = (props) => {
  return (
    <SettingsProvider>
      <Navbar />
      {props.children}
    </SettingsProvider>
  );
};

export default App;
