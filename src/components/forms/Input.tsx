import { FiAlertTriangle } from "solid-icons/fi";
import { JSX, Show, splitProps, type Component } from "solid-js";

export interface InputProps {
  autoComplete?: string;
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date" | "number";
  label?: string;
  placeholder?: string;
  value: string | number | undefined;
  error: string;
  required?: boolean;
  showError?: boolean;
  class?: string;
  disabled?: boolean | undefined;
  ref?: (element: HTMLInputElement) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>;
}

const Input: Component<InputProps> = (props) => {
  const autoComplete = () => (props.autoComplete === undefined ? "off" : props.autoComplete);
  const [, inputProps] = splitProps(props, ["value", "label", "error", "showError"]);
  const styles = getComputedStyle(document.documentElement);
  return (
    <div class={props.class}>
      {props.label && (
        <label for={props.name} class={`block "mb-2" text-sm font-bold text-gray-700`}>
          {props.label}
        </label>
      )}
      <input
        {...inputProps}
        id={props.name}
        value={props.value || ""}
        aria-invalid={!!props.error}
        aria-errormessage={`${props.name}-error`}
        class={`block w-full text-gray-700 border-1 rounded-md bg-white p-2 ${props.error ? "border-red-700" : "border-gray-200"} disabled:bg-gray-300`}
        autocomplete={autoComplete()}
        disabled={props.disabled}
      />
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

export { Input };
