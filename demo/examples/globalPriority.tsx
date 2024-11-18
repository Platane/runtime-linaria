import * as React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";

export const Example = () => (
  <>
    <span className={squareClassName}>
      orange text, overwrote by global style
    </span>
    <ComponentB>Declared second</ComponentB>
    <ComponentC>Declared last</ComponentC>
    <ComponentA>Declared first</ComponentA>
  </>
);

const squareClassName = css`
  background-color: orange;
`;
const ComponentA = styled.div`
  background-color: aqua;
  width: 150px;
  height: 30px;
  :global() {
    .${squareClassName} {
      background-color: aqua;
    }
  }
`;
const ComponentB = styled.div`
  background-color: lime;
  width: 150px;
  height: 30px;
  :global() {
    .${squareClassName} {
      background-color: lime;
    }
  }
`;
const ComponentC = styled.div`
  background-color: red;
  width: 150px;
  height: 30px;
  :global() {
    .${squareClassName} {
      background-color: red;
    }
  }
`;
