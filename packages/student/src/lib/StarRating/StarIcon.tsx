import { JSX } from "solid-js/jsx-runtime";

export interface StarIconProps {
  /** Icon width / height in `px` */
  size?: number;
  SVGstrokeColor?: string;
  SVGstorkeWidth?: string | number;
  SVGclassName?: string;
  SVGstyle?: JSX.CSSProperties;
}

export function StarIcon({
  size = 25,
  SVGstrokeColor = "currentColor",
  SVGstorkeWidth = 0,
  SVGclassName = "star-svg",
  SVGstyle,
}: StarIconProps) {
  return (
    <svg
      class={`${SVGclassName} inline-block`}
      style={SVGstyle}
      stroke={SVGstrokeColor}
      fill="currentColor"
      stroke-width={SVGstorkeWidth}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
    </svg>
  );
}
