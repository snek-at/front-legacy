import * as data from "./IntelData";
//import * as data from "./IntelDummy";

import * as converter from "./Database/Converter";

export async function fill(user) {
  await data.fill(user);
}

export function templateSelect() {
  return data.exec("SELECT * FROM repository");
}

export function user() {
  return converter.getUser(data);
}

export function repos() {
  return converter.getRepositories(data);
}

export function orgs() {
  return converter.getOrganizations(data);
}

export function languages() {
  return converter.getLanguages(data);
}

export function calendar() {
  return converter.getCalendar(data);
}

export function stats() {
  return converter.getStats(data);
}

export function contribTypes() {
  return converter.getContribTypes(data);
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
