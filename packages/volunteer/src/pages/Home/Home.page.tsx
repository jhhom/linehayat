import { useAppStore } from "~/stores/stores";
import LoginPage from "./Login.subpage/Login.subpage";
import { match } from "ts-pattern";
import { createEffect, Show } from "solid-js";
import DashboardPage from "~/pages/Home/Dashboard.subpage";

export default function HomePage() {
  const store = useAppStore((s) => s);

  const profile = useAppStore((s) => s.profile.profile);

  return (
    <>
      {match(profile.status)
        .with("logged-out", () => <LoginPage />)
        .otherwise(() => (
          <DashboardPage />
        ))}
    </>
  );
}
