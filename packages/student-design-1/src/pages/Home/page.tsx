import { Link } from "@solidjs/router";
import { AboutSection1 } from "~/pages/Home/components/AboutSection1";
import { Hero } from "~/pages/Home/components/Hero";

export function HomePage() {
  return (
    <div class="bg-yellow-500/10 px-24 pb-12 pt-20">
      <div class="mx-auto max-w-[1178px]">
        <Hero class="py-12" />
        <Link
          href="/chat"
          class="mx-auto mt-12 block rounded-full bg-cyan-700/30 px-24 py-4 font-bold uppercase shadow-o-md"
        >
          Live Chat
        </Link>
        <AboutSection1 />
      </div>
    </div>
  );
}
