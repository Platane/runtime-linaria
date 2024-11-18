import * as React from "react";
import { styled } from "@linaria/react";

const color = "blue";
export const Square2 = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${() => color};
`;
