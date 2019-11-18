import * as apollo from "./../UtilsApollo";
import * as gqlData from "./GqlData";
import * as translator from "./Translator";

// Get profile and calendar
export async function fill(db, user) {
  const getPlatform = async (db, username) => {
    const apiLink = "https://api.github.com/graphql";
    const authorization = `Bearer ${user.token}`;
    const client = apollo.init(apiLink, authorization);
    const resProfile = await client.query({
      query: gqlData.GET_PROFILE,
      variables: {
        username
      }
    });

    const { data } = resProfile;

    // Debugging point
    //console.log("PROFILE DATA", data);
    const createdAtDate = new Date(data.user.createdAt);

    const resCalendar = await client.query({
      query: gqlData.getCalendar(username, createdAtDate)
    });

    // Debugging point
    //console.log(resCalendar.data.user);

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

    // Debugging point
    //console.log("allReposHistory",allReposWithHistory)

    gqlData.generateRepositoryHistoryQuery(Object.values(reposPerName)).forEach(async (q) => {
      const resRepoHistory = await client.query({
        query: q
      });
      Object.values(resRepoHistory.data).forEach((repo) => {
        let l1 = allReposWithHistory[repo.nameWithOwner].repository.defaultBranchRef.target.history.nodes;
        let l2 = repo.defaultBranchRef.target.history.nodes;
        allReposWithHistory[repo.nameWithOwner].repository.defaultBranchRef.target.history.nodes = l1.concat(l2);
      });
    });
    
    const objUser = {};
    objUser.profile = resProfile.data.user;
    objUser.calendar = resCalendar.data.user;
    objUser.repoCommitHistory = Object.values(allReposWithHistory);

    translator.fillDB(db, objUser);

  };
  await getPlatform(db, user["username"]);
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
