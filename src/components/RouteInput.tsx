import { type Component } from "solid-js";
import { Coordinate } from "../models/coordinate";
import { Input } from "./forms/Input";
import {
  createForm,
  custom,
  maxRange,
  Maybe,
  MaybeArray,
  minRange,
  required,
  SubmitHandler,
  ValidateField,
} from "@modular-forms/solid";
import { useSettings } from "../context/settings";
import { Airspeed } from "../models/airspeed";
import { RoutePoint } from "../models/route";
import { FiSave } from "solid-icons/fi";

type RouteForm = {
  coordinate: string;
  altitude?: number;
  speed: string;
};

const RouteInput: Component<{
  point?: RoutePoint | undefined;
  index: number;
  onSubmit: (point: RoutePoint) => void;
}> = (props) => {
  const [settings] = useSettings()!;

  let initialValues: RouteForm = { coordinate: "", speed: "" };

  if (props.point && props.point.airspeed) {
    initialValues = {
      coordinate: props.point.coordinate.toFormat(settings.coordinateFormat),
      speed: props.point.airspeed?.speedInFormat,
      altitude: props.point.airspeed?.altitude,
    };
  } else if (props.index > 1 && settings.route.points[props.index - 1] !== undefined) {
    initialValues.altitude = settings.route.points[props.index - 1].airspeed!.altitude;
    initialValues.speed = settings.route.points[props.index - 1].airspeed!.speedInFormat;
  }

  const [, { Form, Field }] = createForm<RouteForm>({ initialValues });

  const handleSubmit: SubmitHandler<RouteForm> = (values) => {
    let newPoint: RoutePoint;

    if (!values.speed || !values.altitude) {
      newPoint = { coordinate: new Coordinate(values.coordinate) };
    } else {
      newPoint = {
        coordinate: new Coordinate(values.coordinate),
        airspeed: new Airspeed(values.speed, values.altitude!),
      };
    }

    props.onSubmit(newPoint);
  };

  function validateSpeed(): Maybe<MaybeArray<ValidateField<string>>> {
    const array: Maybe<MaybeArray<ValidateField<string>>> = [
      custom((value) => (value ? Airspeed.IsValid(value).valid : false), "Airspeed must end in C, T, or M"),
    ];
    const array2: Maybe<MaybeArray<ValidateField<string>>> = [required("Enter an airspeed")];
    if (props.index > 0) return array.concat(array2);
    return array;
  }

  function validateAltitude(): Maybe<MaybeArray<ValidateField<number | undefined>>> {
    const array: Maybe<MaybeArray<ValidateField<number | undefined>>> = [
      minRange(0.1, "Altitude must be above sea level"),
      maxRange(100000, "Come closer to earth"),
    ];
    const array2: Maybe<MaybeArray<ValidateField<number | undefined>>> = [required("Enter an altitude")];
    if (props.index > 0) return array.concat(array2);
    return array;
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div class="flex items-center">
          <div class="flex items-center">
            <p class="text-lg mr-4 mb-2 font-bold">{props.index !== undefined ? props.index + 1 : 1}</p>

            <Field
              name="coordinate"
              validate={[
                custom((value) => (value ? Coordinate.isValidText(value) : false), "Invalid Coordinates"),
                required("Enter coordinate"),
              ]}
              validateOn="input"
              revalidateOn="input"
            >
              {(field, fieldProps) => (
                <Input
                  {...fieldProps}
                  type="text"
                  value={field.value}
                  error={field.error}
                  label="Coordinate"
                  showError={true}
                />
              )}
            </Field>
            <Field name="speed" validate={validateSpeed()} validateOn="input" revalidateOn="input">
              {(field, fieldProps) => (
                <Input
                  {...fieldProps}
                  type="text"
                  value={field.value}
                  error={field.error}
                  label="Airspeed"
                  class="ml-2"
                  showError={true}
                  disabled={props.index === 0}
                />
              )}
            </Field>
            <Field name="altitude" type="number" validate={validateAltitude()} validateOn="input" revalidateOn="input">
              {(field, fieldProps) => (
                <Input
                  {...fieldProps}
                  type="number"
                  value={field.value}
                  error={field.error}
                  label="Altitude (MSL)"
                  class="ml-2"
                  showError={true}
                  disabled={props.index === 0}
                />
              )}
            </Field>
          </div>
          <button class="btn btn-icon" type="submit">
            <FiSave size="20" />
          </button>
        </div>
      </Form>
    </>
  );
};

export { RouteInput };
