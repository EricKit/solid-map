import { createEffect, createSignal, For, type Component } from "solid-js";
import { Coordinate, CoordinateFormat } from "../models/coordinate";
import { CoordinateCard } from "./CoordinateCard";
import { Input } from "./forms/Input";
import { createForm, custom, getValue, required } from "@modular-forms/solid";
import { Checkbox } from "./forms/Checkbox";

const ConvertCoordinate: Component = () => {
  type ConvertCoordinateForm = {
    coordinate: string;
    showTrailingZeros: boolean;
  };

  const [coordinate, setCoordinate] = createSignal<Coordinate | undefined>(undefined);
  const [showTrailingZeros, setShowTrailingZeros] = createSignal<boolean>(false);

  const [convertCoordinateForm, { Form, Field }] = createForm<ConvertCoordinateForm>({
    initialValues: { coordinate: undefined, showTrailingZeros: false },
  });

  const [coordinateText, setCoordinateText] = createSignal("No Coordinate Detected");

  const CoordinateFormatArray: CoordinateFormat[] = ["D.D", "D M.M", "D M S.S", "MGRS"];

  createEffect(() => {
    setShowTrailingZeros(getValue(convertCoordinateForm, "showTrailingZeros")!);
  });

  createEffect(() => {
    const newCoordinate = getValue(convertCoordinateForm, "coordinate");
    if (!newCoordinate || !Coordinate.isValidText(newCoordinate)) {
      setCoordinateText("Invalid Coordinate");
      setCoordinate(undefined);
      return;
    }

    const coordinate = new Coordinate(newCoordinate);

    setCoordinate(coordinate);

    if (coordinate && coordinate.detected !== "Not Detected") {
      setCoordinateText(
        `Detected ${coordinate.toFormat(coordinate.detected)} in format ${Coordinate.fullFormatText(coordinate.detected)}`,
      );
    }
  });

  return (
    <>
      <Form>
        <Field
          name="coordinate"
          validate={[
            required("No valid coordinate is entered."),
            custom((value) => (value ? Coordinate.isValidText(value) : false), "Invalid Coordinates"),
          ]}
          validateOn="input"
          revalidateOn="input"
        >
          {(field, props) => (
            <Input
              {...props}
              placeholder="N 16 35.555 W 116 45.00"
              label="Coordinate"
              error={field.error}
              value={field.value}
              type="text"
              required
            />
          )}
        </Field>
        <p class="mt-2 ml-2 text-sm text-gray-500">{coordinateText()}</p>
        <ul class="grid grid-cols-1 gap-5 mt-3 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <For each={CoordinateFormatArray}>
            {(format) => (
              <>
                <CoordinateCard
                  format={format}
                  coordinate={coordinate()}
                  showTrailingZeros={showTrailingZeros()}
                ></CoordinateCard>
              </>
            )}
          </For>
        </ul>
        <div class="flex justify-between mt-4 items-start">
          <Field name="showTrailingZeros" type="boolean">
            {(field, props) => (
              <Checkbox
                {...props}
                label="Show Trailing Zeros"
                error={field.error}
                checked={field.value ?? true}
                required
                class="mr-2"
              ></Checkbox>
            )}
          </Field>
          <div class="hidden md:block">
            <p class="text-xs text-gray-500">
              Changing coordinate formats can introduce rounding errors due to precision
            </p>
            <p class="text-xs text-gray-500">
              D.DDDDDD=0.11m DM.MMMM=0.185m DMS.SS=0.308m MGRS=1m<sup>2</sup>
            </p>
          </div>
        </div>
      </Form>
    </>
  );
};

export { ConvertCoordinate };
