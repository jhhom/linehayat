import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";
import trpc from "./utils/trpc";

import HomePage from "./pages/Home.page";
import ChatPage from "./pages/Chat.page";
import VolunteerLoginPage from "~/pages/VolunteerLogin.page";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={HomePage}></Route>
      <Route path="/chat" component={ChatPage}></Route>
      <Route path="/volunteer-login" component={VolunteerLoginPage}></Route>
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
