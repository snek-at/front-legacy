//> Connect to backend

// A tool to save a graphql query into a variable
import { gql } from "apollo-boost";

// Structure GQL Profile Code
export const GET_PROFILE = gql`
  query getData($username: String!)
  {
    user(login: $username) {
      avatarUrl
      company
      createdAt
      name
      email
      websiteUrl
      hovercard{
        contexts{
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

// Structure GQL Calendar Code
const GET_CALENDAR_QUERY_PART = (year,c) => {
  return `
  c${c}: contributionsCollection(to:"${year}"){
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
        contributions{
          totalCount
          
        }
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
                  edges{
                    node{
                      committedDate
                    }
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
        contributions{
          totalCount
        }
        repository {
          defaultBranchRef{
            target{
              ... on Commit{
                changedFiles
                additions
                deletions
                committedDate
                history{
                  edges{
                    node{
                      committedDate
                    }
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
        contributions{
          totalCount
        }
        repository {
          defaultBranchRef{
            target{
              ... on Commit{
                changedFiles
                additions
                deletions
                committedDate
                history{
                  edges{
                    node{
                      committedDate
                    }
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

// Dynamic generate calenders structure
const generate_calenders_query = (username, createdAtDate) => {

  const date = new Date();
  var query = ``;
  var count = 1;

  while(date.getFullYear() >= createdAtDate.getFullYear()){
      
      query += GET_CALENDAR_QUERY_PART(date.toJSON(),count);

      date.setFullYear(date.getFullYear()-1);
      count++;
  }
  return query;

};

// Get Calendar skeletal structure
export const GET_CALENDAR = (username, createdAt) => {
  const query = gql`
                  query
                  {
                      user(login: "${username}") {
                          ${generate_calenders_query(username, createdAt)}
                      }
                  }
  `
  return query;
};
