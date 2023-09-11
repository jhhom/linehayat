import { onMount, type Component, createSignal } from "solid-js";
import { Route, Routes, Router } from "@solidjs/router";
import { match } from "ts-pattern";

function Home() {
  return (
    <div>
      <p>True</p>
    </div>
  );
}

function Home2() {
  return (
    <div>
      <p>False</p>
    </div>
  );
}

const App: Component = () => {
  const [isAuth, setIsAuth] = createSignal(false);

  return (
    <>
      {match(isAuth())
        .with(true, () => (
          <Routes>
            <Route path="/" component={Home}></Route>
          </Routes>
        ))
        .with(false, () => {
          <Routes>
            <Route path="/" component={Home2}></Route>
          </Routes>;
        })
        .exhaustive()}
    </>
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
