// Reference
// https://github.com/awran5/react-simple-star-rating/tree/main

import { createEffect, mergeProps, on } from "solid-js";
import { StarIcon, StarIconProps } from "./StarIcon";
import { reducer } from "./reducer";
import { createReducer } from "@solid-primitives/reducer";
import { JSX } from "solid-js/jsx-runtime";

type JSXEvent<T, E extends Event> = Parameters<
  JSX.EventHandler<HTMLSpanElement, PointerEvent>
>[0];

export interface RatingProps extends StarIconProps {
  /** Handles the returned rating value */
  onClick?: (
    value: number,
    index: number,
    event?: JSXEvent<HTMLSpanElement, MouseEvent>,
  ) => void;
  /** onPointerMove callback function with `hover`, `index` alongside `event` values passed */
  onPointerMove?: (
    value: number,
    index: number,
    event: JSXEvent<HTMLSpanElement, PointerEvent>,
  ) => void;
  /** onPointerEnter callback function */
  onPointerEnter?: (event: JSXEvent<HTMLSpanElement, PointerEvent>) => void;
  /** onPointerLeave callback function */
  onPointerLeave?: (event: JSXEvent<HTMLSpanElement, PointerEvent>) => void;
  /** Set initial value */
  initialValue?: number;
  /** Number of the icons */
  iconsCount?: number;
  /** Read only mode */
  readonly?: boolean;
  /** Add a group of icons */
  customIcons?: {
    icon: JSX.Element;
  }[];
  /** RTL mode */
  rtl?: boolean;
  /** Enable a fractional rate (half icon) */
  allowFraction?: boolean;
  /** Enable / Disable hover effect on empty icons */
  allowHover?: boolean;
  /** Enable / Disable hover effect on filled icons */
  disableFillHover?: boolean;
  /** Enable / Disable transition effect on mouse hover */
  transition?: boolean;
  /** Applied to the `main` span */
  className?: string;
  /** Inline style applied to the `main` span */
  style?: JSX.CSSProperties;

  /** Custom fill icon SVG */
  fillIcon?: JSX.Element | null;
  /** Filled icons color */
  fillColor?: string;
  /** Array of string to add color range */
  fillColorArray?: string[];
  /** Inline style applied to `filled-icons` icon span  */
  fillStyle?: JSX.CSSProperties;
  /** Filled icons `span` class */
  fillClassName?: string;

  /** Custom empty icon SVG */
  emptyIcon?: JSX.Element | null;
  /** Empty icons color */
  emptyColor?: string;
  /** Inline style applied to `empty-icons` span  */
  emptyStyle?: JSX.CSSProperties;
  /** ٌُEmpty icons `span` class */
  emptyClassName?: string;

  /** Enable / Disable HTML`title` Tag */
  allowTitleTag?: boolean;
  /** Show a tooltip with live values */
  showTooltip?: boolean;
  /** Initial tooltip text if there is no rating value */
  tooltipDefaultText?: string;
  /** Array of strings that will show inside the tooltip */
  tooltipArray?: string[];
  /** Inline style applied to the `tooltip` span */
  tooltipStyle?: JSX.CSSProperties;
  /** Tooltip CSS class */
  tooltipClassName?: string;
  /** Separator word in a title of a rating star `(1 out of 5)` */
  titleSeparator?: string;
}

/**
 * Check for touch devices
 * @returns `boolean`
 */
function isTouchDevice() {
  return (
    (typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches) ||
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}

const defaultProps = {
  initialValue: 0,
  iconsCount: 5,
  size: 40,
  readonly: false,
  rtl: false,
  customIcons: [],
  allowFraction: false,
  className: "react-simple-star-rating",
  transition: false,

  allowHover: false,
  disableFillHover: false,

  fillIcon: null,
  fillColor: "#ffbc0b",
  fillColorArray: [],
  fillClassName: "filled-icons",

  emptyIcon: null,
  emptyColor: "#cccccc",
  emptyClassName: "empty-icons",

  allowTitleTag: true,
  showTooltip: false,
  tooltipDefaultText: "Your Rate",
  tooltipArray: [],
  tooltipClassName: "react-simple-star-rating-tooltip",

  SVGclassName: "star-svg",
  titleSeparator: "out of",
  SVGstorkeWidth: 0,
  SVGstrokeColor: "currentColor",
};

export function StarRating(props: RatingProps) {
  const merged = mergeProps(defaultProps, props);
  const [rating, dispatch] = createReducer(reducer, {
    hoverIndex: 0,
    valueIndex: 0,
    ratingValue: merged.initialValue,
    hoverValue: null,
  });
  createEffect(
    on(
      () => merged.initialValue,
      () => {
        if (merged.initialValue) dispatch({ type: "MouseClick", payload: 0 });
      },
    ),
  );

  const totalIcons = () =>
    merged.allowFraction ? merged.iconsCount * 2 : merged.iconsCount;

  // Convert local rating value to precentage
  const localRating = () => {
    if (merged.initialValue > totalIcons()) return 0;

    // Check for a decimal value
    if (
      !merged.allowFraction &&
      Math.floor(merged.initialValue) !== merged.initialValue
    ) {
      return Math.ceil(merged.initialValue) * 2 * 10;
    }

    return Math.round((merged.initialValue / merged.iconsCount) * 100);
  };

  const localRatingIndex = () =>
    (merged.allowFraction
      ? merged.initialValue * 2 - 1
      : merged.initialValue - 1) || 0;

  const renderValue = (value: number) =>
    merged.iconsCount % 2 !== 0
      ? value / 2 / 10
      : (value * merged.iconsCount) / 100;

  const handlePointerMove = (
    event: Parameters<JSX.EventHandler<HTMLSpanElement, PointerEvent>>[0],
  ) => {
    const { clientX, currentTarget } = event;
    // Get main span element position and width
    const { left, right, width } =
      currentTarget.children[0].getBoundingClientRect();

    // Handle RTL
    const positionX = merged.rtl ? right - clientX : clientX - left;

    // Get current pointer position while moves over the icons
    let currentValue = totalIcons();
    const iconWidth = Math.round(width / totalIcons());

    for (let i = 0; i <= totalIcons(); i = i + 1) {
      if (positionX <= iconWidth * i) {
        if (i === 0 && positionX < iconWidth) currentValue = 0;
        else currentValue = i;
        break;
      }
    }

    const index = currentValue - 1;

    if (currentValue > 0) {
      // Set value and index state
      dispatch({
        type: "PointerMove",
        payload: (currentValue * 100) / totalIcons(),
        index,
      });

      if (merged.onPointerMove) {
        const hoverValue = rating().hoverValue;
        if (hoverValue)
          merged.onPointerMove(renderValue(hoverValue), index, event);
      }
    }
  };

  const handlePointerEnter = (
    event: JSXEvent<HTMLSpanElement, PointerEvent>,
  ) => {
    if (merged.onPointerEnter) merged.onPointerEnter(event);
    // Enable only on touch devices
    if (!isTouchDevice()) return;

    handlePointerMove(event);
  };

  const handleClick = (event?: JSXEvent<HTMLSpanElement, MouseEvent>) => {
    const hoverValue = rating().hoverValue;
    if (hoverValue) {
      dispatch({ type: "MouseClick", payload: hoverValue });
      if (merged.onClick)
        merged.onClick(renderValue(hoverValue), rating().hoverIndex, event);
    }
  };

  const handlePointerLeave = (
    event: JSXEvent<HTMLSpanElement, PointerEvent>,
  ) => {
    if (isTouchDevice()) handleClick();

    dispatch({ type: "PointerLeave" });
    if (merged.onPointerLeave) merged.onPointerLeave(event);
  };

  const valuePercentage = () => {
    if (merged.allowHover) {
      if (merged.disableFillHover) {
        const currentValue =
          (rating().ratingValue && rating().ratingValue) || localRating();
        const hoverValue = rating().hoverValue;
        return hoverValue && hoverValue > currentValue
          ? hoverValue
          : currentValue;
      }
      return (
        (rating().hoverValue && rating().hoverValue) ||
        (rating().ratingValue && rating().ratingValue) ||
        localRating()
      );
    }

    return (rating().ratingValue && rating().ratingValue) || localRating();
  };

  createEffect(
    on(
      () => [merged.tooltipArray.length, totalIcons()],
      () => {
        if (merged.tooltipArray.length > totalIcons()) {
          console.error(
            "tooltipArray Array length is bigger then Icons Count length.",
          );
        }
      },
    ),
  );

  const ratingArray = (array: string[]) => {
    return (
      (rating().hoverValue && array[rating().hoverIndex]) ||
      (rating().ratingValue && array[rating().valueIndex]) ||
      (merged.initialValue && array[localRatingIndex()])
    );
  };

  const ratingRenderValues = () => {
    const hoverValue = rating().hoverValue;
    const ratingValue = rating().ratingValue;
    return (
      (hoverValue && renderValue(hoverValue)) ||
      (ratingValue && renderValue(ratingValue)) ||
      (merged.initialValue && renderValue(localRating()))
    );
  };

  return (
    <span
      class={"star_rating__star-rating-wrap"}
      style={{ direction: `${merged.rtl ? "rtl" : "ltr"}` }}
    >
      <span
        class={`star_rating__simple-star-rating ${merged.className}`}
        style={{
          cursor: merged.readonly ? "" : "pointer",
          ...merged.style,
        }}
        onPointerMove={merged.readonly ? undefined : handlePointerMove}
        onPointerEnter={merged.readonly ? undefined : handlePointerEnter}
        onPointerLeave={merged.readonly ? undefined : handlePointerLeave}
        // @ts-ignore
        onClick={merged.readonly ? undefined : handleClick}
        aria-hidden="true"
      >
        <span
          class={`star_rating__empty-icons ${merged.emptyClassName}`}
          style={{
            color: merged.emptyColor,
            ...merged.emptyStyle,
          }}
        >
          {[...Array(merged.iconsCount)].map((_, index) => (
            <>
              {merged.customIcons[index]?.icon || merged.emptyIcon || (
                <StarIcon
                  SVGclassName={merged.SVGclassName}
                  SVGstyle={merged.SVGstyle}
                  SVGstorkeWidth={merged.SVGstorkeWidth}
                  SVGstrokeColor={merged.SVGstrokeColor}
                  size={merged.size}
                />
              )}
            </>
          ))}
        </span>

        <span
          class={`star_rating__fill-icons ${merged.fillClassName}`}
          style={{
            [merged.rtl ? "right" : "left"]: 0,
            color: ratingArray(merged.fillColorArray) || merged.fillColor,
            transition: merged.transition
              ? "width .2s ease, color .2s ease"
              : "",
            width: `${valuePercentage()}%`,
            ...merged.fillStyle,
          }}
          title={
            merged.allowTitleTag
              ? `${ratingRenderValues()} ${merged.titleSeparator} ${
                  merged.iconsCount
                }`
              : undefined
          }
        >
          {[...Array(merged.iconsCount)].map((_, index) => (
            <>
              {merged.customIcons[index]?.icon || merged.fillIcon || (
                <StarIcon
                  SVGclassName={merged.SVGclassName}
                  SVGstyle={merged.SVGstyle}
                  SVGstorkeWidth={merged.SVGstorkeWidth}
                  SVGstrokeColor={merged.SVGstrokeColor}
                  size={merged.size}
                />
              )}
            </>
          ))}
        </span>
      </span>

      {merged.showTooltip && (
        <span
          class={`star_rating__tooltip ${merged.tooltipClassName}`}
          style={{
            [merged.rtl ? "marginRight" : "marginLeft"]: 20,
            ...merged.tooltipStyle,
          }}
        >
          {(merged.tooltipArray.length > 0
            ? ratingArray(merged.tooltipArray)
            : ratingRenderValues()) || merged.tooltipDefaultText}
        </span>
      )}
    </span>
  );
}
