import { onMount, type Component, createSignal } from "solid-js";
import { Router } from "@solidjs/router";
import { A } from "@solidjs/router";

import type { ServiceInput, ServiceSyncResult } from "@api-contract/types";

function HomePage() {
  const [d, setD] = createSignal(0);

  return (
    <div>
      <div class="flex h-32 items-center justify-center">
        <p class="text-center text-2xl">LineHayat</p>
      </div>
      <div class="flex justify-center">
        <A
          href="/chat"
          class="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Request chat
        </A>
      </div>
    </div>
  );
}

export default HomePage;
