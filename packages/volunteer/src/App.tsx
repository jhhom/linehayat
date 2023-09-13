import { onMount, type Component, createSignal, createEffect } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";
import trpc from "./utils/trpc";

import HomePage from "./pages/Home/Home.page";
import ChatPage from "./pages/Chat.page/Chat.page";

import { match } from "ts-pattern";

import { AppProvider, useAppStore } from "~/stores/stores";
import LoginPage from "~/pages/Home/Login.subpage";
import SidebarLayout from "~/layouts/Sidebar.layout";
import DashboardPage from "~/pages/Home/Dashboard.subpage";

const App: Component = () => {
  const userStatus = useAppStore((s) => s.profile.profile.status);

  return (
    <Routes>
      <Route path="/" component={SidebarLayout}>
        <Route path="/" component={HomePage} />
        <Route path="/chat" component={ChatPage} />
      </Route>
    </Routes>
  );
};

const AppWithRouter = () => {
  return (
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  );
};

export default AppWithRouter;
