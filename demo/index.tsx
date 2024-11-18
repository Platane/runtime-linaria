import * as React from "react";
import { createRoot } from "react-dom/client";

import { Example as Example_className } from "./examples/className";
import { Example as Example_inheritance } from "./examples/inheritance";
import { Example as Example_keyframes } from "./examples/keyframes";
import { Example as Example_componentAs } from "./examples/componentAs";
import { Example as Example_componentVariable } from "./examples/componentVariable";
import { Example as Example_global } from "./examples/global";
import { Example as Example_forwardRef } from "./examples/forwardRef";
import { Example as Example_globalPriority } from "./examples/globalPriority";
import { Example as Example_componentInTemplate } from "./examples/componentInTemplate";
import { Example as Example_componentClosure } from "./examples/componentClosure";

export const App = () => (
  <>
    <section>
      <h1>ClassName</h1>
      <Example_className />
    </section>

    <section>
      <h1>Inheritance</h1>
      <Example_inheritance />
    </section>

    <section>
      <h1>Keyframe name isolation</h1>
      <Example_keyframes />
    </section>

    <section>
      <h1>Component as</h1>
      <Example_componentAs />
    </section>

    <section>
      <h1>Forward ref</h1>
      <Example_forwardRef />
    </section>

    <section>
      <h1>Component variable</h1>
      <Example_componentVariable />
    </section>

    <section>
      <h1>Global</h1>
      <Example_global />
    </section>

    <section>
      <h1>Global priority</h1>
      <Example_globalPriority />
    </section>

    <section>
      <h1>Component in template</h1>
      <Example_componentInTemplate />
    </section>

    <section>
      <h1>Component closure</h1>
      <Example_componentClosure />
    </section>
  </>
);

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
