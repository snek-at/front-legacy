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
    const createdAtDate = new Date(data.user.createdAt);

    const resCalendar = await apollo.client.query({
      query: gqlData.GET_CALENDAR(username, createdAtDate),
    });


    const obj = {};
    obj.profile = resProfile.data.user;
    obj.calendar = resCalendar.data.user;
    return obj
  }

  return getPlatform(username);
}