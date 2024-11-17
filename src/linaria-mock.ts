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
 */
export const cssTemplateString = (
  fragments: TemplateStringsArray,
  ...variables: any[]
) => {
  const fns: ((props: any) => string)[] = [];

  const templatePrefix = getRandomString();

  let cssBody = "";
  for (let i = 0; i < fragments.length; i++) {
    cssBody += fragments[i];
    if (i < variables.length) {
      const v = variables[i];
      if (typeof v === "function") {
        cssBody += "__variable" + templatePrefix + fns.length;
        fns.push(v);
      } else {
        cssBody += v.toString();
      }
    }
  }

  const cssVariables: {
    variableName: string;
    getValue: (props: any) => any;
  }[] = [];

  let i;
  while ((i = cssBody.indexOf("__variable" + templatePrefix)) !== -1) {
    const startIndex = cssBody.substring(0, i).lastIndexOf(":") + 1;
    const endIndex = cssBody.substring(i).search(/([;}]|$)/) + i;

    const template = cssBody.substring(startIndex, endIndex);
    const variableName = generateVariableName();
    cssBody =
      cssBody.substring(0, startIndex) +
      `var(${variableName})` +
      cssBody.substring(endIndex);

    cssVariables.push({
      variableName,
      getValue: (props) =>
        fns.reduce(
          (s, fn, i) =>
            s.replace("__variable" + templatePrefix + i, fn(props)).trim(),
          template,
        ),
    });
  }

  const getVariables = (props = {}) =>
    Object.fromEntries(
      cssVariables.map(({ variableName, getValue }) => [
        variableName,
        getValue(props),
      ]),
    );

  return { cssBody, getVariables };
};

const generateClassName = () => "class-" + getRandomString();
const generateVariableName = () => "--v" + getRandomString();

/**
 * a set of stylis middlewares which aim to replace the keyframes names in a ruleset with uniquely generated one
 */
const createStylisKeyframeRenameMiddleware = () => {
  const nameMap = new Map<string, string>();

  // first pass: get all the keyframes name in a map, generate a unique name for each
  const collect = (element: StylisElement) => {
    if (element.type === "@keyframes") {
      const name = element.props[0];
      nameMap.set(name, name + "-" + getRandomString());
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

  const { collect, replace } = createStylisKeyframeRenameMiddleware();
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
    const className = generateClassName();
    const classNames = [
      ...((componentOrString as any).__runtime_linaria_classNames ?? []),
      className,
    ];
    const { cssBody, getVariables } = cssTemplateString(...args);
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
      toString: () => classNames.map((c) => "." + c).join(" "),
    });
  };
}

const getRandomString = () => Math.random().toString(36).slice(2);

/**
 * mock of linaria/react  styled
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
  const className = generateClassName();

  attachStyleElement([className], cssBody);

  return className;
};

/**
 * minimal version of linaria/core cx
 */
export const cx = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(" ");
