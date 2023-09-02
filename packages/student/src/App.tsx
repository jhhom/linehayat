import { onMount, type Component, createSignal } from "solid-js";
import trpc from "./utils/trpc";

const App: Component = () => {
  const [d, setD] = createSignal(0);

  onMount(async () => {
    const data = await trpc.example.query();
    setD(data.info);
  });

  return (
    <p class="text-4xl text-green-700 text-center py-20">
      Hello tailwind! Query result: {d()}
    </p>
  );
};

export default App;
