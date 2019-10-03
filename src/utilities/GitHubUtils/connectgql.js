//> Connect to backend
import * as apollo from "./apolloclient"

export function get(username) {
  const getPlatform = async (
    username
  ) => {
    const response = await apollo.client.query({
      query: apollo.GET_PROFILE,
      variables: {
        "username": username
      }
    })
    //console.log(response);
    const { data } = response;
    
    //console.log(platform)
    return(data);
    }
    console.log(apollo.GET_PROFILE)
  return getPlatform(username);
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */