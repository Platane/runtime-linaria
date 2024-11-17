import * as React from "react";
import { css } from "@linaria/core";

export const Example = () => (
  <>
    <span className={orangeTextClassName}>
      orange text <b>and this is green</b> !
    </span>
    <div>className: {orangeTextClassName}</div>
  </>
);

const orangeTextClassName = css`
  background-color: orange;

  b {
    background-color: limegreen;
  }
`;