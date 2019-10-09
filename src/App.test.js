// A tool to query data from GitHub
import * as gitHub from "./utilities/GitHubUtils";
// > Dummy
/*
 * Util which writes the dummy into local storage.
 * Get dummy data: JSON.parse(window.localStorage.getItem('DUMMY_DATA'))
 */
import * as dummy from "./utilities/DummyUtils";

// Load dummy file
dummy
.load();

// Load local storage
//JSON.parse(window.localStorage.getItem('DUMMY_DATA'));

// Get GitHub data
const fetchDatafromGitHub = async () => {
  let res = await gitHub.get("torvalds");
  /** 
    if(res.profile.name !== "Linus Torvalds"){
      console.error("Error fetching from GitHub.");
    }
    */
};

fetchDatafromGitHub();

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
