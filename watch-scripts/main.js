import chokidar from "chokidar";
import { exec } from "child_process";
import WATCH_LIST from "./PATH.js";

const systemPaths = WATCH_LIST.map((v) => v.systemPath);

chokidar.watch(systemPaths).on("change", () => {
  exec("npm run deploy", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
});
