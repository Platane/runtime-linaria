import * as React from "react";
import { styled } from "@linaria/react";
import { Square2 } from "./componentClosure2";

export const Example = () => (
  <>
    <p>
      When a component css rule set is is exactly equal, (with the same props
      mappers) it should still be a different component with a different class
      name
    </p>
    <Square />
    <Square2 />
  </>
);

const color = "yellow";
const Square = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${() => color};
`;
