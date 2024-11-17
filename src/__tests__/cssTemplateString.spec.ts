import { expect, it } from "bun:test";
import { cssTemplateString } from "../linaria-mock";

it("should build css", () => {
  const out = cssTemplateString`
        color: ${({ color }: any) => color};
        border: ${({ type }: any) => type} ${10}px ${({ color }: any) => color}
    `;

  const variables = out.getVariables({ color: "blue", type: "solid" });
  expect(Object.keys(variables)).toHaveLength(2);
  expect(Object.values(variables)).toEqual(["blue", "solid 10px blue"]);
});
