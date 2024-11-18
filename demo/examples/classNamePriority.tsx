import * as React from "react";
import { css } from "@linaria/core";

export const Example = () => (
  <>
    <p>
      className with the same content should still be two different className to
      respect priority. (this test is here for me remember to not use className
      based on css content)
    </p>
    <div className={globalReplace}></div>

    <div className={orangeTextClassName}>
      this orange text should be overwritten
    </div>

    <div className={orangeTextClassName2}>
      this orange text should be not overwritten
    </div>
  </>
);

const orangeTextClassName = css`
  background-color: orange;
`;

const globalReplace = css`
  :global() {
    .${orangeTextClassName} {
      background-color: aqua;
    }
  }
`;

const orangeTextClassName2 = css`
  background-color: orange;
`;
