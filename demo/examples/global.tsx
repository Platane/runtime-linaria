import * as React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";

export const Example = () => (
  <>
    <span className={squareClassName}>
      orange text, overwrote by blue global style
    </span>
    <Component />
  </>
);

const squareClassName = css`
  background-color: orange;
`;

const Component = styled.div`
  background-color: yellow;
  width: 50px;
  height: 50px;

  :global() {
    .${squareClassName} {
      background-color: aqua;
    }
  }
`;
