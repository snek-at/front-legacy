import * as v3 from "./API/v3";
import * as v4 from "./API/v4";
import * as translator from "./Translator";

async function getReposNames(user) {
  delete user["__typename"];
  console.log(user)
  let repos = [];
  Object.values(user).forEach(year => {

    year.commitContributionsByRepository.forEach(repo => {
      if (!repos.includes(repo.repository.nameWithOwner)) {
        repos.push(repo.repository.nameWithOwner)
      }
    });
    year.issueContributionsByRepository.forEach(repo => {
      if (!repos.includes(repo.repository.nameWithOwner)) {
        repos.push(repo.repository.nameWithOwner)
      }
    });
    year.pullRequestContributionsByRepository.forEach(repo => {
      if (!repos.includes(repo.repository.nameWithOwner)) {
        repos.push(repo.repository.nameWithOwner)
      }
    });
  })
  return repos;
}
export async function fill(db, user) {

}
export async function fill2(db, user) {
  const v4Con = new v4.Connection("https://api.github.com/graphql", {
    username: user.username,
    token: user.token,
  });

  const data = await v4Con.profile().then(profile => {
    return v4Con.calendar(new Date(profile.user.createdAt)).then(calendar => {
      return getReposNames(calendar.user).then(repos => {
        return {
          profile,
          calendar,
          repos,
        }
      });
    });
  });

  const v3Con = new v3.Connection("api.github.com", {
    username: user.username,
    repositories: data.repos
  });
  console.log(await v3Con.commits())
  // translator.fillDB(db, {
  //   profile,
  //   calendar,
  // });
}