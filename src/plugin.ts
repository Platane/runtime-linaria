import { createFilter, type FilterPattern, type PluginOption } from "vite";
import type { PluginOptions } from "@wyw-in-js/transform";

/**
 * allows linaria to work in runtime mode
 * without the need of any specific transform
 */
export const runtimeLinaria = (
  options: VitePluginOptions = {},
): PluginOption => {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "runtimeLinaria",
    enforce: "pre",
    resolveId(id, url) {
      if (!url || url.includes("node_modules") || !filter(url)) return;

      if (id === "@linaria/core" || id === "@linaria/react") {
        return __dirname + "/linaria-mock.ts";
      }
    },
  };
};

type VitePluginOptions = {
  exclude?: FilterPattern;
  include?: FilterPattern;
} & Pick<PluginOptions, "classNameSlug">;
