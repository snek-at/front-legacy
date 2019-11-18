import { Database } from "../Database";
import * as gitlab from "../utils/UtilsGitlab";
import * as github from "../utils/UtilsGithub";

let db = new Database("data");

export const exec = (statement, values) => {
  return db.exec(statement, values);
};

export async function fill(user) {
  if (user.platformName === "github") {
    await github.fill(db, user);
  } else if (user.platformName === "gitlab") {
    await gitlab.fill(db, user);
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
