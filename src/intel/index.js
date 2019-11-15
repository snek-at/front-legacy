import * as data from "./IntelData";
//import * as data from "./IntelDummy";

import * as converter from "./Database/Converter"

export async function fill(user) {
  await data.fill(user);
}

export function templateGetPlatform() {
  return data.exec("SELECT * FROM calendar");
}

export function user() {
  return converter.getUser(data)
}

export function repos() {
  return converter.getRepositories(data)
}

export function orgs() {
  return converter.getOrganizations(data)
}

export function languages() {
  return converter.getLanguages(data)
}

export function calendar() {
  return converter.getCalendar(data)
}
/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
