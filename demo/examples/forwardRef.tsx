import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let k = 0;
    const i = setInterval(() => {
      ref.current?.style.setProperty(
        "background-color",
        ["orange", "blue", "purple", "pink", "yellow"][k++ % 5],
      );
    }, 800);
    return () => clearInterval(i);
  });

  return <Square ref={ref}>blinking square</Square>;
};

const Square = styled.div`
  width: 100px;
  height: 100px;
  background-color: yellow;
`;
