import { Database } from "../Database";
// Get all utilities for GitLab
import * as gitlab from "../utils/UtilsGitlab";
// Get all utilities for GitHub
import * as github from "../utils/UtilsGithub";

let db = new Database("data");

export const exec = (statement, values) => {
  return db.exec(statement, values);
};

export async function fill(user) {
  if (user.source === "github") {
    await github.fill(db, user);
  } else if (user.source === "gitlab") {
    await gitlab.fill(db, user);
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
