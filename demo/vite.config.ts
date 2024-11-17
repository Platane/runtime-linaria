import linaria from "@wyw-in-js/vite";
import type { UserConfig } from "vite";
import { runtimeLinaria } from "../src/plugin";

export default {
  plugins: [
    process.env.LINARIA_RUNTIME
      ? runtimeLinaria({
          include: ["**/*.tsx"],
        })
      : linaria({
          include: ["**/*.tsx"],
          babelOptions: {
            presets: ["@babel/preset-typescript", "@babel/preset-react"],
          },
        }),
  ],
} satisfies UserConfig;
