// A tool to save a graphql query into a variable
import { gql } from "apollo-boost";

// Structure GQL profile code
export const GET_PROFILE = gql`
  query getData($username: String!) {
    user(login: $username) {
      avatarUrl
      company
      createdAt
      name
      login
      email
      websiteUrl
      hovercard {
        contexts {
          message
          octicon
        }
      }
      isEmployee
      isHireable
      location
      status {
        emojiHTML
        expiresAt
        message
        updatedAt
      }
      organizations(first: 100) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            name
            url
            avatarUrl
            name
            membersWithRole(first: 100) {
              totalCount
              nodes {
                name
                login
                avatarUrl
                url
                projectsUrl
              }
            }
          }
        }
      }
    }
  }
`;

// Structure GQL calendar code
const getCalendarQueryPart = (fromYear, toYear, c) => {
  console.log(fromYear,toYear)
  return `
  c${c}: contributionsCollection(from:"${fromYear}", to:"${toYear}" ){
    contributionYears
    contributionCalendar{
        totalContributions
        weeks{
          contributionDays{
            contributionCount
            date
            color
          }
        }
      }
      commitContributionsByRepository {
        url
        repository {
          defaultBranchRef{
            target{
              ... on Commit{
                changedFiles
                additions
                deletions
                committedDate
                history{
                  totalCount
                  pageInfo{
                    endCursor
                  }
                  nodes{
                    committer{
                      user{
                        login
                      }
                    }
                    committedDate
                  }
                }
              }
            }
          }
          name
          nameWithOwner
          url
          owner{
            avatarUrl
            login
            url
          }
          languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
            totalCount
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      issueContributionsByRepository {
        repository {
          issues(first:100) {
            nodes{
              createdAt
              author{
                login
              }
            }
          }
          name
          nameWithOwner
          url
          owner{
            avatarUrl
            login
            url
          }
          languages(first: 50, orderBy: {field: SIZE, direction: DESC}){
            totalCount
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      pullRequestContributionsByRepository {
        repository {
          pullRequests(first:100) {
            nodes{
              changedFiles
              additions
              deletions
              createdAt
              author{
                login
              }
            }
          }
          name
          nameWithOwner
          url
          owner{
            avatarUrl
            login
            url
          }
          languages(first: 50, orderBy: {field: SIZE, direction: DESC}){
            totalCount
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  `;
};

const getRepositoryHistory = (owner, name, cursor, index) => {
  return `
  ${owner.replace(/-/g, '_')}${name.replace(/-/g, '_')}${index}:repository(owner:"${owner}", name:"${name}"){
    nameWithOwner
    defaultBranchRef{
      target{
        ... on Commit{
          history (after:"${cursor} ${99+index*100}"){
            totalCount
            nodes{
              committer{
                user{
                  login
                }
              }
              committedDate
              changedFiles
              additions
              deletions
            }
          }
        }
      }
    }
    
  }
  `;
};

export const generateRepositoryHistoryQuery = (bigRepos) => {
  let queryParts = [] ;
  const queries = [];
  const query = (part) => gql`
                  query
                  {
                      ${part}
                  }
  `;
  bigRepos.forEach((repo) => {
    let runtime = ~~(repo.repository.defaultBranchRef.target.history.totalCount / 100)
    let cursor = repo.repository.defaultBranchRef.target.history.pageInfo.endCursor.split(" ")[0];
    //console.log(runtime)
    let maxRuntime = 10;
    let partsCount = 0;
    for (let index = 0; index < runtime; index++) {
      if(maxRuntime == 0){
        queries.append(query(queryParts[partsCount]))
        partsCount++;
        maxRuntime = 10;
      }
      queryParts[partsCount] += getRepositoryHistory(repo.repository.owner.login, repo.repository.name, cursor, index)
      
      maxRuntime--;
      //console.log(queryParts)
    }
    //console.log(queryParts)
  });
  //console.log(queryParts)
  
  //console.log(query)
  return queries
}
// Generates a dynamic query structure
const generateCalendarsQuery = (username, createdAtDate) => {
  var currentYear = new Date().getFullYear();

  var fromDate = new Date(createdAtDate.getFullYear(), 0, 2);
  var toDate = new Date(createdAtDate.getFullYear() + 1, 0, 1);

  var query = "";
  var count = 1;

  while (fromDate.getFullYear() <= currentYear) {
    query += getCalendarQueryPart(fromDate.toJSON(), toDate.toJSON(), count);
    console.log(fromDate.toJSON());
    //console.log(date.setDate(date.getDate()-1))

    fromDate.setFullYear(fromDate.getFullYear() + 1);
    toDate.setFullYear(toDate.getFullYear() + 1);
    count++;
  }
  return query;
};

// Get calendar basic structure
export const getCalendar = (username, createdAt) => {
  const query = gql`
                  query
                  {
                      user(login: "${username}") {
                          ${generateCalendarsQuery(username, createdAt)}
                      }
                    }
  `;
  return query;
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */