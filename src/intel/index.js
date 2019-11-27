import * as data from "./IntelData";
//import * as data from "./IntelDummy";

import * as converter from "./Database/Converter";

export async function fill(userList) {
  try{
    for (let index = 0; index < userList.length; index++) {
      const user = userList[index]
      await data.fill(user)
    }
  }
  catch{
    console.error("Data fetching failed.. Please contact our support!", user)
  }
}

export function templateSelect() {
  return data.exec("SELECT * FROM statistic");
}

export function user() {
  try{
    return converter.getUser(data);
  }
  catch{
    //console.warn("Converting user data failed..")
    return undefined;
  }
}

export function repos() {
  try{
    return converter.getRepositories(data);
  }
  catch{
    //console.warn("Converting repository data failed..")
    return undefined;
  }
}

export function orgs() {
  try{
    return converter.getOrganizations(data);
  }
  catch{
    //console.warn("Converting organization data failed..")
    return undefined;
  }
}

export function languages() {
  try{
    return converter.getLanguages(data);
  }
  catch{
    //console.warn("Converting language data failed..")
    return undefined;
  }
}

export function calendar() {
  try{
    return converter.getCalendar(data);
  }
  catch{
    //console.warn("Converting calendar data failed..")
    return undefined;
  }
}

export function stats() {
  try{
    return converter.getStats(data);
  }
  catch{
    //console.warn("Converting statistic data failed..")
    return undefined;
  }
}

export function contribTypes() {
  try{
    return converter.getContribTypes(data);
  }
  catch{
    //console.warn("Converting contrib type data failed..")
    return undefined;
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
