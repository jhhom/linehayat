import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";

import { HomePage } from "~/pages/Home/page";
import { Layout } from "~/pages/layout";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={Layout}>
        <Route path="/" component={HomePage}></Route>
      </Route>
      {/* <Route path="/chat" component={ChatPage}></Route> */}
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
