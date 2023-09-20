import { onMount } from "solid-js";
import { client } from "~/external/api-client/client";
import storage from "~/external/browser/local-storage";
import { useAppStore } from "~/stores/stores";

export function useAutoLogin(v: { username: string; password: string }) {
  const store = useAppStore((s) => s);

  onMount(async () => {
    const r = await client["admin/login"]({
      username: v.username,
      password: v.password,
    });
    if (r.isErr()) {
      alert("Admin login error: " + r.error);
      return;
    }
    storage.setToken(r.value.token);
    store.setProfile("profile", { status: "logged-in" });
  });
}
