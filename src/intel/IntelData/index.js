import { Database } from "../Database";
import * as gitlab from "../utils/UtilsGitlab";
import * as github from "../utils/UtilsGithub";

let db = new Database("data");

export const exec = value => {
  return db.exec(value);
};

export async function fill(user) {
  await gitlab.fill(db, user);
  //github.fill(db, user);
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
