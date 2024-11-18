import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <RotatingSquare>Rotating</RotatingSquare>
    <GrowingSquare>Growing</GrowingSquare>
    <MovingSquare>
      Moving
      <div>nested</div>
    </MovingSquare>
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

const MovingSquare = styled(Square)`
  animation: anim infinite linear 2s alternate-reverse;
  @keyframes anim {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(100px, 0);
    }
  }

  > div {
    animation: anim infinite linear 2s alternate-reverse;

    // interestingly, this keyframe will overwrite the one on the upper scope
    // it seems like nesting does not isolate keyframe names
    // ( with both official and runtime plugin )
    @keyframes anim {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(0, 60px);
      }
    }
  }
`;
