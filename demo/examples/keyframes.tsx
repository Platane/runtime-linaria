import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <RotatingSquare>Rotating</RotatingSquare>
    <GrowingSquare>Growing</GrowingSquare>
  </>
);

const Square = styled.div`
  width: 100px;
  height: 100px;
  background-color: yellow;
  margin: 40px;
`;

const RotatingSquare = styled(Square)`
  animation: anim infinite linear 2s alternate-reverse;
  @keyframes anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const GrowingSquare = styled(Square)`
  animation: anim infinite linear 2s alternate-reverse;
  @keyframes anim {
    0% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1.4);
    }
  }
`;
