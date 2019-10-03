//> Connect to backend
import * as apollo from "./apolloclient"
import * as gqlData from "./gqlData"

// Get Profile and Calendar
export function get(username) {
  const getPlatform = async (
    username
  ) => {
    const resProfile = await apollo.client.query({
      query: gqlData.GET_PROFILE,
      variables: {
        "username": username
      }
    });

    const {data} = resProfile;
    return data
  }

  return getPlatform(username);
}