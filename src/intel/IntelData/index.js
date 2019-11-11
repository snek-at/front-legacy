import { Database } from "../Database";
import * as gitlab from "../utils/UtilsGitlab";
import * as github from "../utils/UtilsGithub";

let db = new Database("data");

export const exec = value => {
  return db.exec(value);
};

export async function fill(user) {
  //gitlab.fill(db, user);
  await github.fill(db, user);
}
