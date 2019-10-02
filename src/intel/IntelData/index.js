import { Database } from "../Database";
import * as gitlab from "../utils/UtilsGitlab";
import * as github from "../utils/UtilsGitlab";

let db = new Database("data");

export const exec = (value) => {return db.exec(value);};

export function fill(user){
    //gitlab.fill(db, user);
    //github.fill(db, user);
};