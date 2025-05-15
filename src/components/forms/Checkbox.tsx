import { FiAlertTriangle } from "solid-icons/fi";
import { JSX, Show, splitProps, type Component } from "solid-js";

export interface CheckboxProps {
  name: string;
  label?: string;
  checked: boolean;
  error: string;
  required?: boolean;
  showError?: boolean;
  class?: string;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const [, inputProps] = splitProps(props, ["checked", "label", "error", "showError", "class"]);
  const styles = getComputedStyle(document.documentElement);

  return (
    <div class={`${props.class ?? ""} flex items-center`}>
      <input
        {...inputProps}
        id={props.name}
        type="checkbox"
        checked={props.checked}
        class={`mr-2 block ${props.error ? "border-red-700" : "border-gray-200"}`}
        aria-invalid={!!props.error}
        aria-errormessage={`${props.name}-error`}
      />

      {props.label && (
        <label for={props.name} class={`block "mb-2" text-sm font-bold text-gray-700`}>
          {props.label}
        </label>
      )}
      <Show when={props.showError}>
        <div class="mt-1 mb-2">
          <div class="flex items-center h-4">
            <Show when={props.error}>
              {props.error && <FiAlertTriangle color={styles.getPropertyValue("color-danger")} size="12" />}
              <p class="pl-2 text-xs italic text-danger">{props.error}</p>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export { Checkbox };
