import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => <LabelD>yellow text</LabelD>;

const LabelA = styled.span`
  background-color: red;
`;
const LabelB = styled(LabelA)`
  background-color: blue;
`;
const LabelC = styled(LabelB)`
  background-color: green;
`;
const LabelD = styled(LabelC)`
  background-color: yellow;
`;
