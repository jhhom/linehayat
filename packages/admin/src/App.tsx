import { onMount, type Component, createSignal, createEffect } from "solid-js";

import SidebarLayout from "~/layouts/Sidebar.layout";
import { AppProvider, useAppStore } from "~/stores/stores";
import { useAutoLogin } from "~/hooks/use-auto-login";
import { Router, Routes, Route } from "@solidjs/router";
import VolunteersTablePage from "~/pages/VolunteersTable/VolunteersTable.page";
import FeedbacksTablePage from "~/pages/FeedbacksTable/FeedbacksTable.page";
import FeedbacksTablePage2 from "~/pages/FeedbacksTable/FeedbacksTable2/FeedbacksTable2.page";

const App: Component = () => {
  const userProfile = useAppStore((s) => s.profile);

  useAutoLogin({ username: "admin", password: "admin123" });

  return (
    <Routes>
      <Route path="/" component={SidebarLayout}>
        <Route path="/" component={VolunteersTablePage} />
        <Route path="/feedbacks" component={FeedbacksTablePage2} />
      </Route>
    </Routes>
  );
};

const AppWithProvider = () => {
  return (
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  );
};

export default AppWithProvider;
