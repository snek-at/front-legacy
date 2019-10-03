// Import
import * as gitHub from "./utilities/GitHubUtils"

// Get GitHub data
const fetchDatafromGitHub = async () => {   
    let res = await gitHub.get('torvalds');
    if(res){
      console.log(res)
    } else {
      console.log("Error fetching from GitHub.");
    }
  }

fetchDatafromGitHub();