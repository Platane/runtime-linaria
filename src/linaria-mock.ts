import * as React from "react";
import isPropValid from "@emotion/is-prop-valid";
import {
  compile,
  type Element as StylisElement,
  middleware,
  serialize,
  stringify,
} from "stylis";

/**
 * This files exports mock of linaria css and styled
 *
 * Those should yield the same result as linaria transform, but at runtime. Without the need to run a babel on all tsx files.
 */

/**
 * to be used as a tagged template string
 *
 * returns the body of the css
 * if the template contains function, it replace the result with a generated css variable, which can be set with getVariables
 *
 * @example cssTemplateString`  some-css: ${ props => props.color }`;
 *
 * notice that the variable does not exactly match the template string function.
 * instead it wrap the whole css value
 *
 * @example cssTemplateString`  border: solid ${ props => props.color } ${ props => props.size }px`;
 *       // {
 *       //    cssBody: "border: var(--vxxx)";
 *       // }
 */
export const cssTemplateString = (
  fragments: TemplateStringsArray,
  ...variables: any[]
) => {
  const getFragmentValueFns: ((props: any) => string)[] = [];

  const variableFragmentPrefix = "__variable_" + getRandomString() + "_";

  let cssBody = "";
  for (let i = 0; i < fragments.length; i++) {
    cssBody += fragments[i];
    if (i < variables.length) {
      const v = variables[i];
      if (typeof v === "function") {
        cssBody += variableFragmentPrefix + getFragmentValueFns.length;
        getFragmentValueFns.push(v);
      } else {
        cssBody += v.toString();
      }
    }
  }

  const cssVariables: {
    variableName: string;
    valueMapperHash: string;
    getValue: (props: any) => any;
  }[] = [];

  let k = 0;
  let i;
  while ((i = cssBody.indexOf(variableFragmentPrefix)) !== -1) {
    const cssValueStartIndex = cssBody.substring(0, i).lastIndexOf(":") + 1;
    const cssValueEndIndex = cssBody.substring(i).search(/([;}]|$)/) + i;

    const cssPropertyNameEndIndex = cssValueStartIndex - 1;
    const cssPropertyName =
      cssBody
        .substring(0, cssPropertyNameEndIndex)
        .match(/([\w-]+)\s*$/)?.[1] ?? "v";
    const variableName = "--" + cssPropertyName + "-" + k++;

    const template = cssBody.substring(cssValueStartIndex, cssValueEndIndex);

    cssBody =
      cssBody.substring(0, cssValueStartIndex) +
      `var(${variableName})` +
      cssBody.substring(cssValueEndIndex);

    const getValue = (props: any) =>
      getFragmentValueFns
        .reduce(
          (s, getFragmentValue, i) =>
            s.replace(variableFragmentPrefix + i, getFragmentValue(props)),
          template,
        )
        .trim();

    const valueMapperHash = getStringHash(
      getFragmentValueFns.reduce(
        (s, getFragmentValue, i) =>
          s.replace(variableFragmentPrefix + i, getFragmentValue.toString()),
        template,
      ),
    );

    cssVariables.push({ variableName, valueMapperHash, getValue });
  }

  /**
   * given a set of props, compute the css variables
   */
  const getVariables = (props = {}) =>
    Object.fromEntries(
      cssVariables.map(({ variableName, getValue }) => [
        variableName,
        getValue(props),
      ]),
    );

  return {
    cssBody,
    getVariables,
    valueMappersHash: cssVariables.map((v) => v.valueMapperHash).join(""),
  };
};

const valueMappersHashCount = new Map<string, number>();
const getClassName = (cssBody: string, valueMappersHash: string) => {
  const hash = getStringHash(cssBody + valueMappersHash);

  if (!valueMappersHash) return "c" + hash;

  let i = (valueMappersHashCount.get(valueMappersHash) ?? 0) + 1;
  valueMappersHashCount.set(valueMappersHash, i);

  return "c" + hash + i;
};

/**
 * a set of stylis middlewares which aim to replace the keyframes names in a ruleset with uniquely generated one
 */
const createStylisKeyframeRenameMiddleware = (prefix: string) => {
  const nameMap = new Map<string, string>();

  // first pass: get all the keyframes name in a map, generate a unique name for each
  const collect = (element: StylisElement) => {
    if (element.type === "@keyframes") {
      const name = element.props[0];
      nameMap.set(name, "_" + prefix + "-" + name.trim());
    }
  };

  // second pass: replace the keyframes names
  const replace = (element: StylisElement) => {
    if (element.type === "@keyframes") {
      const name = element.props[0];
      const newName = nameMap.get(name) ?? name;

      element.value = "@keyframes " + newName;
    }

    if (
      element.type === "decl" &&
      element.props === "animation" &&
      typeof element.children === "string"
    ) {
      const children = element.children
        .split(" ")
        .map((v) => nameMap.get(v) ?? v)
        .join(" ");

      element.value = "animation:" + children;
    }
  };

  return { collect, replace };
};

/**
 * create a style element and attach it to the dom
 */
const attachStyleElement = (classNames: string[], cssBody: string) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  let css = classNames.map((c) => "." + c).join("") + `{${cssBody}}`;

  // generate the tree
  const compiled = compile(css);

  const prefix = getStringHash(classNames.join());
  const { collect, replace } = createStylisKeyframeRenameMiddleware(prefix);
  serialize(compiled, collect);

  css = serialize(compiled, middleware([replace, stringify]));

  // hacky hoisting of global style
  // there is likely a smarted way to do this with a stylis middleware
  css = css.replaceAll(/[^{};,]*:global\(\)/g, "");

  const styleElement = document.createElement("style");
  document.body.appendChild(styleElement);

  styleElement.innerHTML = css;

  return () => {
    document.body.removeChild(styleElement);
  };
};

function enhanceComponent(componentOrString: React.ComponentType | string) {
  return (...args: Parameters<typeof cssTemplateString>) => {
    const { cssBody, getVariables, valueMappersHash } = cssTemplateString(
      ...args,
    );

    const className = getClassName(cssBody, valueMappersHash);
    const classNames = [
      ...((componentOrString as any).__runtime_linaria_classNames ?? []),
      className,
    ];

    attachStyleElement(classNames, cssBody);

    const enhancedComponent = React.forwardRef((props: any, ref) => {
      const cssVariables = getVariables(props);

      const style = { ...props.style, ...cssVariables };

      if (typeof componentOrString === "string") {
        let elementString = componentOrString;

        const { as, ...rest } = props;

        if (typeof as === "string") {
          elementString = as;
        }

        const propsForHtml = Object.fromEntries(
          Object.entries(rest).filter(([key]) => isPropValid(key)),
        );

        return React.createElement(
          elementString,
          {
            ...propsForHtml,
            ref,
            style,
            className: cx(props.className, className),
          },
          props.children,
        );
      }

      return React.createElement(
        componentOrString,
        {
          ...props,
          ref,
          style,
          className: cx(props.className, className),
        },
        props.children,
      );
    });

    return Object.assign(enhancedComponent, {
      __runtime_linaria_classNames: classNames,
      toString: () => classNames.map((c) => "." + c).join(" "), // overwrite the toString method so a component can be used in template string
    });
  };
}

const getRandomString = () => Math.random().toString(36).slice(2);

/**
 * return the string hash
 * idk where I got this hash function but it seems to work
 */
const getStringHash = (string: string) =>
  string
    .split("")
    .reduce(
      (hash, char) => char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash,
      0,
    )
    .toString(36)
    .replaceAll(/\W/g, "");

/**
 * mock of linaria/react  styled
 * allows the syntax styled.div to translate to enhanceComponent('div')
 */
export const styled = new Proxy(enhanceComponent, {
  get(o, prop) {
    return o(prop as string);
  },
});

/**
 * mock of linaria/core  css
 */
export const css = (...args: Parameters<typeof cssTemplateString>) => {
  const o = cssTemplateString(...args);

  const cssBody =
    o.cssBody +
    ";\n" +
    Object.entries(o.getVariables())
      .map(([name, value]) => `${name}:${value}`)
      .join(";");
  const className = getClassName(cssBody, "");

  attachStyleElement([className], cssBody);

  return className;
};

/**
 * minimal version of linaria/core cx
 */
export const cx = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(" ");
