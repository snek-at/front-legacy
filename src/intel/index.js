// Import Database
import * as data from "./IntelData";
//import * as data from "./IntelDummy";

// Import Converter
import * as converter from "./Database/Converter";

// Return the database with user values
export async function fill(userList) {

  async function retry(maxRetries, fn, params) {
      return await fn(...params).catch(() => {
        if (maxRetries <= 0) {
          console.error(`Could not fetch data after ${maxRetries} retries... Please try again later!`);
          return false;
        }
        return retry(maxRetries - 1, fn, params);
      });
  }

  for (let index = 0; index < userList.length; index++) {
    const user = userList[index];
    const maxRetries = 5;
      await retry(maxRetries, data.fill, [user]).catch((err) => {
        throw err;
      });
    
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
    return undefined;
  }
}

export function repos() {
  try{
    return converter.getRepositories(data);
  }
  catch{
    return undefined;
  }
}

export function orgs() {
  try{
    return converter.getOrganizations(data);
  }
  catch{
    return undefined;
  }
}

export function languages() {
  try{
    return converter.getLanguages(data);
  }
  catch{
    return undefined;
  }
}

export function calendar() {
  try{
    return converter.getCalendar(data);
  }
  catch{
    return undefined;
  }
}

export function stats() {
  try{
    return converter.getStats(data);
  }
  catch{
    return undefined;
  }
}

export function contribTypes() {
  try{
    return converter.getContribTypes(data);
  }
  catch{
    return undefined;
  }
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
