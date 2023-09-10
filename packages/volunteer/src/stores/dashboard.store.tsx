import { ParentComponent, createContext, useContext } from "solid-js";
import { StudentId } from "@api-contract/types";
import { createStore } from "solid-js/store";
import { DashboardUpdate } from "@api-contract/subscription";

type Dashboard = {
  dashboard: DashboardUpdate;
};

export const makeDashboardContext = () => {
  const [dashboard, setDashboard] = createStore<Dashboard>({
    dashboard: {
      onlineVolunteers: [],
      pendingRequests: [],
    },
  });

  return {
    dashboard,
    setDashboard,
  };
};

export const DashboardContext =
  createContext<ReturnType<typeof makeDashboardContext>>();

export const DashboardProvider: ParentComponent = (props) => {
  const Dashboard = makeDashboardContext();

  return (
    <DashboardContext.Provider value={Dashboard}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const c = useContext(DashboardContext);
  if (c === undefined) {
    throw new Error(`Dashboard Context is undefined`);
  }

  return c;
};
