import { Component, JSX } from "solid-js";

interface PageTemplateProps {
  headerText: string;
  class?: string;
  children?: JSX.Element;
}

const PageTemplate: Component<PageTemplateProps> = ({ children, headerText, className }) => {
  return (
    <>
      <header class="bg-white shadow not-printed">
        <div class="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">{headerText}</h1>
        </div>
      </header>
      <main>
        <div class={`py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 ${className} print:w-screen print:p-0 print:max-w-none`}>
          {children}
        </div>
      </main>
    </>
  );
};

export { PageTemplate };
