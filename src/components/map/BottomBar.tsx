import { Component } from "solid-js";
import Coordinate from "../../models/coordinate";

const BottomBar: Component<{ mouseCoordinate: Coordinate }> = (props) => {
  return (
    <div class="bg-gray-800">
      <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-center h-8">
          <div
            class="ml-4 px-1 py-0 rounded-md text-sm leading-5 active:bg-gray-500 hover:text-white 
     hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out cursor-pointer w-72"
            //   onClick={changeFormat}
          >
            {/* <span class="font-light text-gray-500 pr-3">{coordinateFormat}</span> */}
            <span class="font-medium text-gray-300">{props.mouseCoordinate?.toFormat("D M.M") ?? ""}</span>
          </div>
          <div
            class="ml-4 px-1 py-0 rounded-md text-sm leading-5 active:bg-gray-500 hover:text-white 
     hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out cursor-pointer w-36"
            // onClick={showBullseyeForm}
          >
            <span class="font-light text-gray-500 pr-3">Bullseye</span>
            {/* <span class="font-medium text-gray-300">{getBullseye()}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export { BottomBar };
