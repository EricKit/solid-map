import { Component, JSX } from "solid-js";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  headerText?: string;
  children?: JSX.Element;
}

const Card: Component<Props> = ({ headerText, ...props }) => {
  const classes = " bg-white overflow-hidden shadow rounded-lg";

  if (props.class) {
    props.class += classes;
  } else {
    props.class = classes;
  }

  return (
    <>
      <div {...props}>
        {headerText && (
          <div class="px-4 py-5 text-lg font-bold border-b border-gray-200 sm:px-6 font-headlines">{headerText}</div>
        )}
        <div class="px-4 py-5 bg-gray-50 sm:p-6">{props.children}</div>
      </div>
    </>
  );
};

export { Card };
