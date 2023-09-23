import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";

import HomePage from "./pages/Home.page";
import ChatPage from "./pages/Chat.page";
import { FeedbackPage } from "~/pages/Feedback.page";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/chat" component={ChatPage}></Route>
      <Route path="/feedback" component={FeedbackPage}></Route>
      <Route path="/" component={HomePage}></Route>
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
