"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeLinaria = void 0;
var vite_1 = require("vite");
/**
 * allows linaria to work in runtime mode
 * without the need of any specific transform
 */
var runtimeLinaria = function (options) {
  if (options === void 0) {
    options = {};
  }
  var filter = (0, vite_1.createFilter)(options.include, options.exclude);
  return {
    name: "runtimeLinaria",
    enforce: "pre",
    resolveId: function (id, url) {
      if (!url || url.includes("node_modules") || !filter(url)) return;
      if (id === "@linaria/core" || id === "@linaria/react") {
        return __dirname + "/../src/linaria-mock.ts";
      }
    },
  };
};
exports.runtimeLinaria = runtimeLinaria;
