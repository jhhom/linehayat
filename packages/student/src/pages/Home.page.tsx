import { onMount, type Component, createSignal } from "solid-js";
import { Router } from "@solidjs/router";
import trpc from "~/utils/trpc";
import { A } from "@solidjs/router";

function HomePage() {
  const [d, setD] = createSignal(0);

  onMount(async () => {
    const data = await trpc.example.query();
    setD(data.info);
  });

  return (
    <div>
      <div class="h-32 flex items-center justify-center">
        <p class="text-center text-2xl">LineHayat</p>
      </div>
      <div class="flex justify-center">
        <A
          href="/chat"
          class="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md"
        >
          Request chat
        </A>
      </div>
    </div>
  );
}

export default HomePage;
