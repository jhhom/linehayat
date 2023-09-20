import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      "@backend": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "../shared/api-contract"),
    },
  },
});
