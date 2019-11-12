import * as insert from "../../Database/Statements/Insert";
import * as webscrap from "../UtilsWebscrap";
let db;

//> Export functions
// Fill the Database from user object
export const fill = (_db, user) => {
  db = _db;
  return fillPlatform(user);
};