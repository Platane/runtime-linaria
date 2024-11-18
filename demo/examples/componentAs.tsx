import * as React from "react";
import { styled } from "@linaria/react";

export const Example = () => (
  <>
    <p>Support of the as props to change the final html element</p>

    <Link href="#">I am not a link</Link>

    <Link as="a" href="#">
      I am a link
    </Link>

    <Link2 as="a" href="#">
      me too
    </Link2>

    <Link href="#">I am still not a link</Link>
  </>
);

const Link: any = styled.span`
  color: limegreen;
  display: block;
`;
const Link2: any = styled(Link)`
  color: green;
`;
