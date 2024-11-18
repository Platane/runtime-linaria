import { type FilterPattern, type PluginOption } from "vite";
import type { PluginOptions } from "@wyw-in-js/transform";
/**
 * allows linaria to work in runtime mode
 * without the need of any specific transform
 */
export declare const runtimeLinaria: (
  options?: VitePluginOptions,
) => PluginOption;
type VitePluginOptions = {
  exclude?: FilterPattern;
  include?: FilterPattern;
} & Pick<PluginOptions, "classNameSlug">;
export {};
