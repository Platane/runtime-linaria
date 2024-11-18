import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <p>
      A component can be used in a css template string, the component className
      is then used
    </p>
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
