import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <Square />
    <Container>
      <Square />
    </Container>
  </>
);

const Square = styled.div`
  width: 100px;
  height: 100px;
  background-color: yellow;
`;

const Container = styled.div`
  ${Square} {
    background-color: orange;
  }

  ${Square}:hover {
    background-color: purple;
  }
`;
