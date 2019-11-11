import * as apollo from "./../UtilsApollo";
import * as gqlData from "./gqlData";
import * as translator from "./translator";

// Get profile and calendar
export async function fill(db, user) {
  const getPlatform = async (db, username) => {
    const apiLink = "https://api.github.com/graphql";
    const authorization = `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`;
    const client = apollo.init(apiLink, authorization);
    const resProfile = await client.query({
      query: gqlData.GET_PROFILE,
      variables: {
        username
      }
    });

    const { data } = resProfile;
    const createdAtDate = new Date(data.user.createdAt);

    const resCalendar = await client.query({
      query: gqlData.getCalendar(username, createdAtDate)
    });

    const objUser = {};
    objUser.profile = resProfile.data.user;
    objUser.calendar = resCalendar.data.user;
    translator.fillDB(db, objUser);
  };
  console.log(user["username"]);
  await getPlatform(db, user["username"]);
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
