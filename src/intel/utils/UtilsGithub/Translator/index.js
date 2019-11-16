import * as insert from "../../../Database/Statements/Insert";
let db;
let streak = false;
let streakStart = "";
let streakTotal = 0;

//> Helper functions
// Get an Array with Contributions from contributionsByRepository Object
const getContributionsByRepositories = (contributionsByRepository, type, user) => {
  let contribs = [];
  contributionsByRepository.forEach(repo => {
    const repoNameWithOwner = repo.repository.nameWithOwner;
    const repoUrl = repo.repository.url;
    if(type === "commit"){
      repo.repository.defaultBranchRef.target.history.edges.forEach(edge => {
        if(edge.node.author.user !== null) {
          if(edge.node.author.user.login === user) {
            let contrib = {};
            const date = edge.node.committedDate.split("T")[0];
            contrib["date"] = date;
            contrib["repoNameWithOwner"] = repoNameWithOwner;
            contrib["repoUrl"] = repoUrl;
            contrib["additions"] = edge.node.additions;
            contrib["deletions"] = edge.node.deletions;
            contrib["changedFiles"] = edge.node.changedFiles;
            contribs.push(contrib);
          }
        }
      });
    }
    else if(type === "issue"){
      repo.repository.issues.nodes.forEach((node) => {
        if(node.author.login === user) {
          let contrib = {};
          const date = node.createdAt.split("T")[0];
          contrib["date"] = date;
          contrib["repoNameWithOwner"] = repoNameWithOwner;
          contrib["repoUrl"] = repoUrl;
          contrib["additions"] = null;
          contrib["deletions"] = null;
          contrib["changedFiles"] = null;
          contribs.push(contrib);
        }
      });
    }
    else if(type === "pullRequest"){
      repo.repository.pullRequests.nodes.forEach((node) => {
        if(node.author.login === user) {
          let contrib = {};
          const date = node.createdAt.split("T")[0];
          contrib["date"] = date;
          contrib["repoNameWithOwner"] = repoNameWithOwner;
          contrib["repoUrl"] = repoUrl;
          contrib["additions"] = node.additions;
          contrib["deletions"] = node.deletions;
          contrib["changedFiles"] = node.changedFiles;
          contribs.push(contrib);
        }
      });
    }
  });
  return contribs;
};

// Get the busiest Day from year Object
const getBusiestDay = year => {
  let busiestDay = null;
  year.forEach(day => {
    if (busiestDay == null) {
      busiestDay = day;
    } else {
      if (day.contributionCount > busiestDay.contributionCount) {
        busiestDay = day;
      }
    }
  });
  return busiestDay;
};

// Get an Array of Days from User Object
const getDaysArray = (objUser, keys) => {
  let days = [];
  keys.forEach(c => {
    const year = objUser.calendar[c.toString()];
    for (const [w, week] of year.contributionCalendar.weeks.entries()) {
      for (const [d, day] of week.contributionDays.entries()) {
        days.push(day);
      }
    }
  });
  return days;
};

// Get an Dictionary of Years from Days Array
// Key: year, Value: Array of Days
const getYearsDict = days => {
  let years = {};
  days.forEach(day => {
    const year = new Date(day.date).getFullYear();
    if (years[parseInt(year)] === undefined) {
      years[parseInt(year)] = [];
    }
    years[parseInt(year)].push(day);
  });
  return years;
};

//> Fill functions
// Fill the platform Table
const fillPlatform = objUser => {
  let statusMessage;
  let statusEmojiHTML;

  if (objUser.profile.status) {
    statusMessage = objUser.profile.status.message;
    statusEmojiHTML = objUser.profile.status.emojiHTML;
  } else {
    statusMessage = null;
    statusEmojiHTML = null;
  }

  const avatarUrl = objUser.profile.avatarUrl;
  const websiteUrl = objUser.profile.websiteUrl;
  const company = objUser.profile.company;
  const email = objUser.profile.email;
  const fullName = objUser.profile.name;
  const createdAt = objUser.profile.createdAt;
  const location = objUser.profile.location;
  const username = objUser.profile.login;

  db.exec(insert.platform, [
    "GitHub",
    "https://github.com",
    avatarUrl,
    websiteUrl,
    company,
    email,
    username,
    fullName,
    createdAt,
    location,
    statusMessage,
    statusEmojiHTML
  ]);
};

// Fill the member Table with Organization Members
const fillOrgMembers = (nodes, orgId) => {
  nodes.forEach(_member => {
    const memberAvatarUrl = _member.avatarUrl;
    const memberName = _member.name;
    const memberWebUrl = _member.url;
    const memberUsername = _member.login;
    db.exec(insert.member, [
      memberAvatarUrl,
      memberName,
      memberUsername,
      memberWebUrl
    ]);
    const memberId = db.exec("SELECT id FROM member").pop()["id"];

    db.exec(insert.organizationHasMember, [orgId, memberId]);
  });
};

// Fill organization Table
const fillOrganization = objUser => {
  objUser.profile.organizations.edges.forEach(_org => {
    const avatarUrl = _org.node.avatarUrl;
    const name = _org.node.name;
    const url = _org.node.url;
    db.exec(insert.organization, [avatarUrl, name, url]);

    const organizationId = db.exec("SELECT id FROM organization").pop()["id"];
    const platformId = db.exec("SELECT id FROM platform").pop()["id"];

    db.exec(insert.platformHasOrganization, [platformId, organizationId]);
    fillOrgMembers(_org.node.membersWithRole.nodes, organizationId);
  });
};

// Fill streak Table
const fillStreak = year => {
  year.forEach(day => {
    const dayTotal = day.contributionCount;
    const dayDate = day.date;

    if (dayTotal !== 0) {
      if (!streak) {
        streak = true;
        streakStart = dayDate;
        streakTotal = dayTotal;
      } else {
        streakTotal += dayTotal;
      }
    } else if (streakTotal !== 0) {
      const statisticId = db.exec("SELECT id FROM statistic").pop()["id"];
      db.exec(insert.streak, [
        streakStart,
        new Date(new Date(dayDate).getTime() - 24 * 60 * 60 * 1000)
          .toISOString()
          .substr(0, 10),
        streakTotal,
        statisticId
      ]);
      streak = false;
      streakStart = "";
      streakTotal = 0;
    }
  });
};

// Fill statistic Table
const fillStatistic = (year, busiestDayDate) => {
  const yearNum = new Date(busiestDayDate).getFullYear();
  const busiestDayId = db.exec("SELECT id FROM busiestDay").pop()["id"];
  const platformId = db.exec("SELECT id FROM platform").pop()["id"];
  db.exec(insert.statistic, [yearNum, busiestDayId, platformId]);
  fillStreak(year);
};

// Fill busiestDay Table
const fillBusiestDay = years => {
  Object.keys(years).forEach(y => {
    const year = years[parseInt(y)];
    const busiestDay = getBusiestDay(year);
    const busiestDayDate = busiestDay.date;
    const busiestDayCount = busiestDay.contributionCount;

    db.exec(insert.busiestDay, [busiestDayDate, busiestDayCount]);
    fillStatistic(year, busiestDayDate);
  });
};

// Prepare data to call functions related to Stats
const fillStats = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  const days = getDaysArray(objUser, keys);
  const years = getYearsDict(days);
  fillBusiestDay(years);
};

// Fill repository Table
const fillRepository = _repo => {
  const repoOwnerId = db.exec("SELECT id FROM member").pop()["id"];
  const name = _repo.repository.name;
  const repoUrl = _repo.repository.url;
  const pieId = db.exec("SELECT id FROM languagePie").pop()["id"];
  db.exec(insert.repository, [repoUrl, name, repoOwnerId, pieId]);
  const repoId = db.exec("SELECT id FROM repository").pop()["id"];
  const platformId = db.exec("SELECT id FROM platform").pop()["id"];
  db.exec(insert.platformHasRepository, [platformId, repoId]);
};

// Fill member Table with Repository Owner
const fillRepoOwner = _repo => {
  const repoOwnerUsername = _repo.repository.owner.login;
  const repoOwnerAvatarUrl = _repo.repository.owner.avatarUrl;
  const repoOwnerName = _repo.repository.owner.name;
  const repoOwnerUrl = _repo.repository.owner.url;
  db.exec(insert.member, [
    repoOwnerAvatarUrl,
    repoOwnerName,
    repoOwnerUsername,
    repoOwnerUrl
  ]);
  fillRepository(_repo);
};

// Fill languageSlice Table
const fillLanguageSlice = _repo => {
  const pieId = db.exec("SELECT id FROM languagePie").pop()["id"];
  _repo.repository.languages.edges.forEach(_edge => {
    const nodeName = _edge.node.name;
    const nodeSize = _edge.size;
    const nodeColor = _edge.node.color;
    db.exec(insert.languageSlice, [nodeName, nodeColor, nodeSize, pieId]);
  });
  fillRepoOwner(_repo);
};

// Fill languagePie Table
const fillPie = reposi => {
  reposi.forEach(_repo => {
    if (
      db.exec("SELECT name from repository WHERE name=?", [
        _repo.repository.name
      ])[0] == null
    ) {
      const languagesCount = _repo.repository.languages.totalCount;
      const languagesSize = _repo.repository.languages.totalSize;
      db.exec(insert.languagePie, [languagesSize, languagesCount]);
      fillLanguageSlice(_repo);
    }
  });
};

// Prepare data to call Tables related to Repositories
const fillRepos = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  keys.forEach(c => {
    const reposi =
      objUser.calendar[c.toString()].commitContributionsByRepository;
    fillPie(reposi);
  });
};

// Fill contribs Table
const fillContribs = (contribs, type, calendarId) => {
  contribs.forEach(contrib => {
    db.exec(insert.contrib, [
      contrib.date,
      contrib.repoNameWithOwner,
      contrib.repoUrl,
      contrib.additions,
      contrib.deletions,
      contrib.changedFiles,
      type,
      calendarId
    ]);
  });
};

// fill calendar Table
const fillCalendar = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  keys.forEach(c => {
    const year = objUser.calendar[c.toString()];
    for (const [w, week] of year.contributionCalendar.weeks.entries()) {
      for (const [d, day] of week.contributionDays.entries()) {
        const date = day.date;
        const week = w;
        const weekday = d;
        const total = day.contributionCount;
        const color = day.color;
        const platformId = db.exec("SELECT id FROM platform").pop()["id"];
        db.exec(insert.calendar, [
          date,
          week,
          weekday,
          total,
          color,
          platformId
        ]);
      }
    }
    const user = db.exec("SELECT username FROM platform").pop()["username"];
    const commits = getContributionsByRepositories(
      year.commitContributionsByRepository,
      "commit",
      user
    );
    console.log(commits)
    const issues = getContributionsByRepositories(
      year.issueContributionsByRepository,
      "issue",
      user
    );
    const pullRequests = getContributionsByRepositories(
      year.pullRequestContributionsByRepository,
      "pullRequest",
      user
    );
    const calendarId = db.exec("SELECT id FROM calendar").pop()["id"];

    fillContribs(commits, "commit", calendarId);
    fillContribs(issues, "issue", calendarId);
    fillContribs(pullRequests, "pullRequest", calendarId);
  });
};

// Fill the Database from User Object
export const fillDB = (_db, objUser) => {
  db = _db;
  fillPlatform(objUser);
  fillOrganization(objUser);
  fillStats(objUser);
  fillRepos(objUser);
  fillCalendar(objUser);
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
