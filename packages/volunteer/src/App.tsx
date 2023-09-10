import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";
import trpc from "./utils/trpc";

import HomePage from "./pages/Home/Home.page";
import ChatPage from "./pages/Chat.page";

import { AppProvider } from "~/stores/store";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={HomePage}></Route>
      <Route path="/chat" component={ChatPage}></Route>
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
