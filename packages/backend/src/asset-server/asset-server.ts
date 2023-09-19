import express from "express";
import path from "path";

import { PROJECT_ROOT } from "@backend/config/config";

export const runAssetServer = () => {
  const app = express();
  const port = 4002;

  const assetPath = path.join(PROJECT_ROOT, "assets");

  app.use(express.static(assetPath));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

runAssetServer();
