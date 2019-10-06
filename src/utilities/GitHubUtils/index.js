// Builds a object from github user
import * as connect from "./connectgql";

export function get(username) {
    return connect.get(username);
}

