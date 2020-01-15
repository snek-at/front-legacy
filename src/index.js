//> React
// Contains all the functionality necessary to define React components
import React from "react";
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from "react-dom";

//> Ant Design
// CSS
import 'antd/dist/antd.css';

//> CSS
// Root SCSS file
import "./index.scss";

//> Components
// Root component
import App from "./App";

import registerServiceWorker from "./registerServiceWorker";

// Render the root component to <div id="root"></div>
ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker();

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
