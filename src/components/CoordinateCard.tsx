import { type Component } from "solid-js";

const CoordinateCard: Component<{ title: string; subTitle: string }> = (props) => {
  const copyCoordinate = (coordinate: string) => {
    if (!document) return;
    const el = document.createElement("textarea");
    el.value = coordinate;
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.setAttribute("readonly", "");
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  return (
    <li class="flex items-center col-span-1 overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm">
      <div class="flex-1 px-4 py-2 truncate">
        <div class="text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out hover:text-gray-600">
          {props.title}
        </div>
        <p class={`text-sm leading-5 text-gray-500 ${!props.subTitle && "opacity-0"}`}>{props.subTitle || "N 24 24"}</p>
      </div>
      <div class="flex-shrink-0 pr-2">
        <button
          onClick={() => props.subTitle && copyCoordinate(props.subTitle)}
          class="inline-flex items-center justify-center w-8 h-8 text-teal-400 transition duration-150 ease-in-out bg-transparent rounded-full hover:text-teal-500 focus:outline-none focus:text-teal-500 focus:bg-teal-100"
        >
          <svg class="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
            <path fill="currentColor" d="M232 706h142c22.1 0 40 17.9 40 40v142h250V264H232v442z" />
            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32z" />
            <path d="M704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" />{" "}
          </svg>
        </button>
      </div>
    </li>
  );
};

export { CoordinateCard };
