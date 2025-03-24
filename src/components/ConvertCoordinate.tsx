import { createEffect, createSignal, type Component } from "solid-js";
import Coordinate from "../models/coordinate";
import { CoordinateCard } from "./CoordinateCard";
import { Input } from "./forms/Input";
import { createForm, custom, getValue, required } from "@modular-forms/solid";

const ConvertCoordinate: Component = () => {
  type ConvertCoordinateForm = {
    coordinate: string;
  };

  const [coordinate, setCoordinate] = createSignal<Coordinate | undefined>(undefined);
  const [convertCoordinateForm, { Form, Field }] = createForm<ConvertCoordinateForm>();

  const [coordinateText, setCoordinateText] = createSignal("No Coordinate Detected");

  createEffect(() => {
    console.log("effect is running");
    const newCoordinate = getValue(convertCoordinateForm, "coordinate");
    if (!newCoordinate || !Coordinate.isValidText(newCoordinate)) return;

    const coordinate = new Coordinate(newCoordinate);

    setCoordinate(coordinate);

    if (coordinate && coordinate.detected !== "Not Detected") {
      setCoordinateText(`Detected Format: ${coordinate.detected} - Detected Coordinate:
          ${coordinate.toFormat(coordinate.detected)}`);
    }
    console.log(coordinateText);
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
        <ul class="grid grid-cols-1 gap-5 mt-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CoordinateCard
            title="Degrees Minutes Seconds"
            subTitle={coordinate()?.degreesMinutesSecondsDecimalSeconds ?? ""}
          ></CoordinateCard>
          <CoordinateCard
            title="Degrees Minutes"
            subTitle={coordinate()?.degreesMinutesDecimalMinutes ?? ""}
          ></CoordinateCard>
          <CoordinateCard title="Degrees" subTitle={coordinate()?.degreesDecimalDegrees ?? ""}></CoordinateCard>
          <CoordinateCard title="MGRS" subTitle={coordinate()?.toFormat("MGRS") ?? ""}></CoordinateCard>
        </ul>
      </Form>
    </>
  );
};

export { ConvertCoordinate };
