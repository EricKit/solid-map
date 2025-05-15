import { Component, For, Show } from "solid-js";
import { useSettings } from "../context/settings";
import { FiEdit3, FiPlus } from "solid-icons/fi";

const RouteTable: Component<{
  edit: (index: number) => number;
  start?: number | undefined;
  end?: number | undefined;
  showLabels?: boolean;
}> = (props) => {
  const [settings] = useSettings()!;

  function showEnd(index: number): boolean {
    if (props.start && index < props.start) return false; //After Start
    if (props.end === undefined) return true; //If no end defined, show it
    if (index > props.end) return false; //If it's after the end, remove it
    return true;
  }

  return (
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <Show when={props.showLabels !== false}>
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        #
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Coordinate
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Speed
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Altitude
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Leg Dist
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Total Dist
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Leg Time
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Total Time
                      </th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                </Show>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <For each={settings.route.points}>
                    {(point, index) => {
                      return (
                        <Show when={showEnd(index())}>
                          <tr>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {index() + 1}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {point.coordinate.toFormat(settings.coordinateFormat)}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {point.airspeed?.speedInFormat}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {point.airspeed?.altitude}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {index() !== 0 && settings.route.legDistTextToPoint(index(), "ft")}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {index() !== 0 && settings.route.totDistTextToPoint(index(), "ft")}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {index() !== 0 && settings.route.legTimeTextToPoint(index())}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {index() !== 0 && settings.route.totTimeTextToPoint(index())}
                            </td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button class="btn btn-icon" on:click={() => props.edit(index())}>
                                <FiEdit3 />
                              </button>
                              <button class="btn btn-icon" on:click={() => props.edit(index() + 1)}>
                                <FiPlus />
                              </button>
                            </td>
                          </tr>
                        </Show>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RouteTable };
