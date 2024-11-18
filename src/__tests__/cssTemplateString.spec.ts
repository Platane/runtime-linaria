import { expect, it } from "bun:test";
import { cssTemplateString } from "../linaria-mock";

it("should build variables", () => {
  const out = cssTemplateString`
        color:${({ color }: any) => color};
        border:${({ type }: any) => type} ${10}px ${({ color }: any) => color};
    `;

  const variables = out.getVariables({ color: "blue", type: "solid" });

  const css = Object.entries(variables).reduce(
    (css, [key, value]) => css.replace(key, value),
    out.cssBody,
  );

  expect(Object.keys(variables)).toHaveLength(2);
  expect(css).toBe(`
        color:var(blue);
        border:var(solid 10px blue);
    `);
});

it("should return a hash for the value mapper", () => {
  const out1 = cssTemplateString`
        color:${({ color }: any) => color};
        border:${({ type }: any) => type} ${10}px ${({ color }: any) => color};
    `;

  const out2 = cssTemplateString`
        color:${({ color }: any) => color};
        border:${({ type }: any) => type} ${10}px ${({ color }: any) => color};
    `;

  const out3 = cssTemplateString`
        color:${({ color }: any) => color};
        border:${({ type1 }: any) => type1} ${10}px ${({ color }: any) => color};
    `;

  expect(out1.valueMappersHash).toBe(out2.valueMappersHash);
  expect(out1.valueMappersHash).not.toBe(out3.valueMappersHash);
});
