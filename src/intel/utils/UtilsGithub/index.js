//> Apollo 
import * as apollo from "./../UtilsApollo";
// Queries for Apollo
import * as gqlData from "./GqlData";
// Used to put data to database
import * as translator from "./Translator";

// Get profile and calendar
export async function fill(db, user) {
  const getPlatform = async (db, username) => {
    const apiLink = "https://api.github.com/graphql";
    const authorization = `Bearer ${user.token}`;
    const client = apollo.init(apiLink, authorization);
    const resProfile = await client.query({
      errorPolicy: "ignore",
      query: gqlData.GET_PROFILE,
      variables: {
        username
      }
    });

    const { data } = resProfile;

    // Debugging point
    const createdAtDate = new Date(data.user.createdAt);

    const resCalendar = await client.query({
      errorPolicy: "ignore",
      query: gqlData.getCalendar(username, createdAtDate)
    });

    let allReposWithHistory = {};
    let reposPerName = {};
    Object.values(resCalendar.data.user).forEach((c) => {
      if(c !== "User"){
        c.commitContributionsByRepository.forEach((repo) => {
          if(repo.repository.defaultBranchRef.target.history.totalCount >= 100){
            reposPerName[repo.repository.nameWithOwner] = repo;
            
          }
          allReposWithHistory[repo.repository.nameWithOwner] = repo;
        });
      }
    });
    
    const objUser = {};
    objUser.profile = resProfile.data.user;
    objUser.calendar = resCalendar.data.user;

    translator.fillDB(db, objUser);
  };
  await getPlatform(db, user["username"]);
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
