import { ParentComponent, createContext, useContext } from "solid-js";
import { StudentId } from "@api-contract/types";
import { createStore } from "solid-js/store";

export type Volunteer = {
  status: "typing" | "idle";
};

export const makeVolunteerContext = () => {
  const [volunteer, setVolunteer] = createStore<Volunteer>({
    status: "idle",
  });

  return {
    volunteer,
    setVolunteer,
  };
};

export const VolunteerContext =
  createContext<ReturnType<typeof makeVolunteerContext>>();

export const VolunteerProvider: ParentComponent = (props) => {
  const volunteer = makeVolunteerContext();

  return (
    <VolunteerContext.Provider value={volunteer}>
      {props.children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteer = () => {
  const c = useContext(VolunteerContext);
  if (c === undefined) {
    throw new Error(`Volunteer Context is undefined`);
  }

  return c;
};
