import * as test from "./utilities/GitHubUtils"

const fetchDatafromGitHub = async () => {
    // Get GitHub data
    let res = await test.get('schettn');
    if(res){
      console.log(res)
    } else {
      console.log("Error fetching from GitHub.");
    }
  }

fetchDatafromGitHub();