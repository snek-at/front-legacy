import * as intel from "./intel";

intel
  .fill({
    username: "pinterid",
    server: "gitlab.htl-villach.at",
    platformName: "GitLab"
  })
  .then(() => {
    console.log(intel.templateGetPlatform());
  });

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
