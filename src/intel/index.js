//import * as data from "./IntelData";
import * as data from "./IntelDummy";

export function fill(user) {
    data.fill(user)
};

export function templateGetPlatform() {
    return data.exec("SELECT * FROM platform")
};
