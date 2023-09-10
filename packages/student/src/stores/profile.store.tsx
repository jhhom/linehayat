import { ParentComponent, createContext, useContext } from "solid-js";
import { StudentId } from "@api-contract/types";
import { createStore } from "solid-js/store";

type Profile = {
  status: "idle" | "chatting" | "waiting";
};

export const makeProfileContext = () => {
  const [profile, setProfile] = createStore<Profile>({
    status: "idle",
  });

  return {
    profile,
    setProfile,
  };
};

export const ProfileContext =
  createContext<ReturnType<typeof makeProfileContext>>();

export const ProfileProvider: ParentComponent = (props) => {
  const profile = makeProfileContext();

  return (
    <ProfileContext.Provider value={profile}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const c = useContext(ProfileContext);
  if (c === undefined) {
    throw new Error(`Profile Context is undefined`);
  }

  return c;
};
