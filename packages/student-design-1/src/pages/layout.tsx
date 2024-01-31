import { JSX, ParentProps } from "solid-js";
import { Navbar } from "~/pages/Home/components/Navbar";

export function Layout(props: ParentProps) {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
}
