import { FiAlertTriangle } from "solid-icons/fi";
import { JSX, Show, type Component } from "solid-js";

interface FormItemProps {
  labelText: string;
  errorText?: string;
  horizontal?: boolean;
  labelLast?: boolean;
  showError?: boolean;
  class?: string;
  children?: JSX.Element;
  attributes?: JSX.HTMLAttributes<HTMLDivElement>;
}

function ErrorElement({ errorText }: { errorText?: string }) {
  const styles = getComputedStyle(document.documentElement);

  return (
    <>
      <div class="flex items-center h-4">
        {errorText && <FiAlertTriangle color={styles.getPropertyValue("color-danger")} size="12" />}
        <p class="pl-2 text-xs italic text-danger">{errorText}</p>
      </div>
    </>
  );
}

const FormItem: Component<FormItemProps> = (props) => {
  const defaultClass = "flex-grow flex-shrink-0 relative";

  const newclass = () => props.class ?? defaultClass;
  return (
    <>
      <div class={newclass()} {...props.attributes}>
        <div class={`${props.horizontal && "flex items-center"}`}>
          <Show when={props.labelLast}>{props.children}</Show>

          <label>
            <div class={`block ${props.horizontal ? "mx-2" : "mb-2"} text-sm font-bold text-gray-700`}>
              {props.labelText}
            </div>
          </label>
        </div>

        <Show when={!props.labelLast}>{props.children}</Show>

        <Show when={props.showError}>
          <div class="mt-1 mb-2">
            <ErrorElement errorText={props.errorText ?? ""} />
          </div>
        </Show>
      </div>
    </>
  );
};

export { FormItem };
