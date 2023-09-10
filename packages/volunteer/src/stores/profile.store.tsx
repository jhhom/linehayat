import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export type Profile = {
  profile:
    | {
        status: "logged-out";
      }
    | {
        status: "idle";
        username: string;
        email: string;
      }
    | {
        status: "busy-chatting";
        username: string;
        email: string;
      };
};

export const makeProfileContext = () => {
  const [profile, setProfile] = createStore<Profile>({
    profile: {
      status: "logged-out",
    },
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
