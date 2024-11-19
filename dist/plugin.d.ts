import { type FilterPattern, type PluginOption } from "vite";
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
};
export {};
