import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";
import trpc from "./utils/trpc";

import LoginPage from "~/pages/Login.page";
import DashboardPage from "~/pages/Dashboard.page";
import ChatPage from "~/pages/Chat.page/Chat.page";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={LoginPage}></Route>
      <Route path="/dashboard" component={DashboardPage}></Route>
      <Route path="/chat" component={ChatPage}></Route>
    </Routes>
  );
};

const AppWithRouter = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWithRouter;
