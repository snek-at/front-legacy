import * as data from "./IntelData";
//import * as data from "./IntelDummy";

export async function fill(user) {
  await data.fill(user);
}

export function templateGetPlatform() {
  return data.exec("SELECT * FROM platform");
}
