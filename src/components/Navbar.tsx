import { A, useLocation } from "@solidjs/router";
import { Component, createEffect, createSignal, JSX } from "solid-js";

type Props = Record<string, never>;

const Item: Component<{ href: string; sidebar?: boolean; children?: JSX.Element }> = ({
  href,
  sidebar = false,
  children,
}) => {
  const [active, setActive] = createSignal(false);
  const location = useLocation();

  createEffect(() => {
    setActive(location.pathname === href);
  });

  const className = () => {
    if (active() && sidebar)
      return `block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 active:bg-gray-500 
      focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out`;
    if (!active() && sidebar)
      return `mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 active:bg-gray-500 hover:text-white 
      hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out`;
    if (active() && !sidebar)
      return `ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-white bg-gray-900 active:bg-gray-500 
      focus:outline-none focus:text-white focus:bg-gray-700  transition duration-150 ease-in-out`;
    if (!active() && !sidebar)
      return `ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 active:bg-gray-500 hover:text-white 
    hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out`;
  };

  return (
    <A href={href} class={className()}>
      {children}
    </A>
  );
};

const Navbar: Component<Props> = () => {
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <div>
      <nav class="bg-gray-800">
        <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8 not-printed">
          <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* <!-- Mobile menu button--> */}
              <button
                class="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                aria-label="Main menu"
                aria-expanded="false"
                onClick={() => {
                  setMenuOpen(!menuOpen());
                }}
              >
                {/* <!-- Icon when menu is closed. -->*/}
                <svg
                  class={`${menuOpen() ? "hidden" : "block"} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* <!-- Icon when menu is open. -->*/}
                <svg
                  class={`${menuOpen() ? "block" : "hidden"} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <div class="flex-shrink-0">
                <img class="block w-auto h-8 lg:hidden" src="/bombing-run.svg" alt="Workflow logo" />
                <img class="hidden w-auto h-8 lg:block" src="/bombing-run.svg" alt="Workflow logo" />
              </div>
              <div class="hidden sm:block sm:ml-6">
                <div class="flex items-center">
                  <Item href="/">Planning Tools</Item>
                  <Item href="/test">Test</Item>
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Item href="https://dieselplanning.com">Old Dieselplanning</Item>
            </div>
          </div>
        </div>

        {menuOpen() && (
          <div>
            <div class="px-2 pt-2 pb-3">
              <Item href="/" sidebar>
                Planning Tools
              </Item>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export { Navbar };
