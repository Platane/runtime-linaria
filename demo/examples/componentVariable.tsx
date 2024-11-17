import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <Box color="red" borderWidth={4} borderColor="blue" />
    <Box color="yellow" borderWidth={14} borderColor="purple" />
  </>
);

const Box = styled.div<{
  color: string;
  borderWidth: number;
  borderColor: string;
}>`
  width: 100px;
  height: 100px;
  margin: 10px;
  border: solid ${(props) => props.borderWidth}px
    ${(props) => props.borderColor};
  background-color: ${(props) => props.color};
`;
