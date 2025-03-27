import { Component } from "solid-js";
import Coordinate from "../../models/coordinate";
import { useSettings } from "../../context/settings";
import { roundAndTruncate } from "../../library/lib";

const BottomBar: Component<{ mouseCoordinate: Coordinate }> = (props) => {
  const [settings, setSettings] = useSettings()!;

  const changeFormat = () => {
    switch (settings.coordinateFormat) {
      case "D M S.S":
        setSettings("coordinateFormat", "D M.M");
        break;
      case "D M.M":
        setSettings("coordinateFormat", "D.D");
        break;
      case "D.D":
        setSettings("coordinateFormat", "MGRS");
        break;
      case "MGRS":
        setSettings("coordinateFormat", "D M S.S");
        break;
    }
  };

  return (
    <div class="bg-gray-800">
      <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-center h-8">
          <div
            class="ml-4 px-1 py-0 rounded-md text-sm leading-5 active:bg-gray-500 hover:text-white 
     hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out cursor-pointer w-72"
            on:click={changeFormat}
          >
            <span class="font-light text-gray-500 pr-3">{settings.coordinateFormat}</span>
            <span class="font-medium text-gray-300">
              {props.mouseCoordinate?.toFormat(settings.coordinateFormat ?? "D M.M") ?? ""}
            </span>
          </div>
          <div
            class="ml-4 px-1 py-0 rounded-md text-sm leading-5 active:bg-gray-500 hover:text-white 
     hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out cursor-pointer w-36"
          >
            <span class="font-light text-gray-500 pr-3">Bullseye</span>
            <span class="font-medium text-gray-300">{props.mouseCoordinate.bullseyeText(settings.bullseye)}</span>
          </div>
          <div
            class="ml-4 px-1 py-0 rounded-md text-sm leading-5 active:bg-gray-500 hover:text-white 
     hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out cursor-pointer w-36"
          >
            <span class="font-light text-gray-500 pr-3">MagVar</span>
            <span class="font-medium text-gray-300">{roundAndTruncate(props.mouseCoordinate.magVar, 1, 1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export { BottomBar };
