//> Connect to backend

//Import
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
