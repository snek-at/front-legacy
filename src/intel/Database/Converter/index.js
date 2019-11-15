import * as select from "../Statements/Select"

// Formats a date to YYYY-MM-DD format
const formatDate = (date) => { console.log(date); return date.toISOString().split('T')[0] };


export function getUser(data) {
  let platforms = data.exec(select.platform);

  // Use information of platform 0 as basic information
  let platform = platforms[0];
  let user = {};
  user.avatarUrl = platform.avatarUrl;
  user.company = platform.company;
  user.createdAt = platform.createdAt;
  user.name = platform.fullName;
  user.username = platform.username;
  user.email = platform.email;
  user.websiteUrl = platform.websiteUrl;
  user.status = platform.status;
  user.statusEmojiHTML = platform.statusEmojiHTML;
  user.isEmployee = false;
  user.isHireable = false;
  user.location = platform.location;

  return user
}

export function getOrganizations(data) {
  let organizations = data.exec(select.organization)

  let orgs = {}
  console.log(organizations)
  organizations.forEach(orgWithMember => {
    if (!orgs[orgWithMember.oId]) {
      let org = {}
      org.name = orgWithMember.oName;
      org.url = orgWithMember.oUrl;
      org.avatarUrl = orgWithMember.oAvatarUrl;
      org.memberCount = 0;
      org.membersWithRole = [];
      orgs[orgWithMember.oId] = org;
    }

    let member = {};
    member.oid = orgWithMember.oId;
    member.name = orgWithMember.mName
    member.login = orgWithMember.mUsername
    member.avatarUrl = orgWithMember.mAvatarUrl
    member.url = orgWithMember.mUrl
    member.projectsUrl = null;

    orgs[orgWithMember.oId].membersWithRole.push(member)

  })
  return orgs
}

export function getRepositories(data) {
  let repositories = data.exec(select.repository)

  let repos = {}
  repositories.forEach(repoWithExtras => {
    if (!repos[repoWithExtras.rId]) {
      let repo = {}
      repo.name = repoWithExtras.rName;
      repo.avatarUrl = repoWithExtras.oAvatarUrl;

      repo.owner = {}
      repo.owner.name = repoWithExtras.oName;
      repo.owner.login = repoWithExtras.oUsername;
      repo.owner.url = repoWithExtras.oUrl;

      repo.languagePie = {}
      repo.languagePie.size = repoWithExtras.lSize;
      repo.languagePie.total = repoWithExtras.lTotal;
      repo.languagePie.slices = []

      repos[repoWithExtras.rId] = repo;

    }

    let slice = {};
    slice.name = repoWithExtras.sName;
    slice.color = repoWithExtras.sColor;
    slice.size = repoWithExtras.sSize;

    repos[repoWithExtras.rId].languagePie.slices.push(slice)
  });


  return repos
}

export function getLanguages(data) {
  let languages = data.exec(select.language)
  let totalSize = data.exec(select.totalLanguageSize)[0].num;
  console.log(totalSize)
  let slices = {}

  languages.forEach(languageSlice => {
    if (!slices[languageSlice.sName]) {
      let slice = {}
      slice.name = languageSlice.sName;
      slice.color = languageSlice.sColor;
      slice.size = languageSlice.sSize;
      slice.share = Math.round(slice.size / totalSize * 100 * 100) / 100;

      slices[languageSlice.sName] = slice;
    } else {
      slices[languageSlice.sName].size += languageSlice.sSize;
      slices[languageSlice.sName].share = Math.round(slices[languageSlice.sName].size / totalSize * 100 * 100) / 100;
    }

  })
  return slices
}
