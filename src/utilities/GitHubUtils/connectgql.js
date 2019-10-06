// Connect to backend
import * as apollo from "./apolloclient";
import * as gqlData from "./gqlData";

// Get profile and calendar
export function get(username) {
  const getPlatform = async (
    username
  ) => {
    const resProfile = await apollo.client.query({
      query: gqlData.GET_PROFILE,
      variables: {
          username
      }
    });

    const {data} = resProfile;
    const createdAtDate = new Date(data.user.createdAt);

    const resCalendar = await apollo.client.query({
      query: gqlData.get_CALENDAR(username, createdAtDate),
    });


    const obj_user = {};
    obj_user.profile = resProfile.data.user;
    obj_user.calendar = resCalendar.data.user;
    return obj_user;
  };

  return getPlatform(username);
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
