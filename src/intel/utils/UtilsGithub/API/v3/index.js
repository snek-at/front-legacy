async function head(link, token) {
  return await fetch(link, {
    headers: {
      authorization: `token: ${token}`
    }
  })
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        return response.json()
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

export class Connection {
  constructor(link, user) {
    /*
    user:
      username: "",
      token: "",
    */
    if (link) {
      const parts = link.split("://")
      parts[0] === link ? this.link = link : this.link = parts[1];
      this.user = user;
      this.reposLink = `https://${this.link}/users/${user.username}/repos`;
      this.commitLink = (repo, pageIndex) => `https://${this.link}/repos/${repo}/commits?author=${this.user.username}&page=${pageIndex}`;
      this.issueLink = (repo, pageIndex) => `https://${this.link}/repos/${repo}/issues?state=all&creator=${this.user.username}&page=${pageIndex}`;
      this.pullLink = (repo, pageIndex) => `https://${this.link}/search/issues?q=repo:${repo}+author:${this.user.username}+is:pr&page=${pageIndex}`;
      this.pullAllLink = (repo, pageIndex) => `https://${this.link}/search/issues?q=repo:${repo}+reviewed-by:${this.user.username}+is:pr&page=${pageIndex}`;
      this.reviewLink = (pullUrl, pageIndex) => `${pullUrl}/reviews?&page=${pageIndex}`;
    } else {
      throw "No valid link!"
    };
  }

  /*
  Deactivated due to to much pages
  async commits(){
    return await this.contributions(this.commitLink)
  }
  */

  async reviews(){
    return this.contributions(this.pullAllLink).then(pulls => {
      
      return this.contributionReviews(this.reviewLink, pulls).then(reviews => {
        return reviews
      })
    })
  }

  async issues(){
    return await this.contributions(this.issueLink)
  }

  async pulls(){
    return await this.contributions(this.pullLink)
  }

  async contributions(linkFn) {
    //!this.repositoryLinks.length > 0 && await initRepositories();
    let commitsOfUserPerRepo = {};
    for (const repo of this.user.repositories) {
      commitsOfUserPerRepo[repo] = []
      let pageIndex = 1;
      var pill2kill = false;

      while (!pill2kill) {
        const commitsOfUser = await head
          (linkFn(repo, pageIndex), this.user.token);
        if (commitsOfUser.length > 0) { 
            commitsOfUser.forEach(contrib => {
              // Check if issue is no pull request
              if(!contrib.pull_request){
                commitsOfUserPerRepo[repo].push(contrib)
              }
            })
            pageIndex++;
        }
        else if(commitsOfUser.items){
          if(commitsOfUser.items.length > 0){
            commitsOfUser.items.forEach(contrib => {
              commitsOfUserPerRepo[repo].push(contrib)
          })
          pageIndex++;
          }else{
            break;
          }
              
        } else{
          break;
        }
      }
    }
    return commitsOfUserPerRepo;
  }

  async contributionReviews(linkFn, repoWithPulls) {
    let reviewsPerRepo = {};
    for(const [repoName, pulls] of Object.entries(repoWithPulls)){
      //console.log(repoName, pulls)
      reviewsPerRepo[repoName] = []
      var pill2kill = false;
      for(const pull of pulls){
        let pageIndex = 1
        //console.log(pull)
        while (!pill2kill) {
          const res = await head
            (linkFn(pull.pull_request.url, pageIndex), this.user.token);
            //console.log(res)
          if (res.length > 0) {
            pageIndex++;
            //console.log(res)
            res.forEach(review => {
              if(review.user.login === this.user.username){
                reviewsPerRepo[repoName].push(review);
              }
            })
          }else{
            break;
          }
        }
      }
    }
    return reviewsPerRepo
    
  }

}