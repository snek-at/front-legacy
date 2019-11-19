import * as insert from "../../../Database/Statements/Insert";
import { fill } from "..";

let db;
let streak = false;
let streakStart = "";
let streakTotal = 0;

//> Helper functions
// Get an Array with Contributions from contributionsByRepository Object
const genContributionsByRepositories = function* (contributionsByRepository, type, username) {
  for (const repo of contributionsByRepository) {
    switch(type){
      case "commit":
        yield repo.repository.defaultBranchRef.target.history.nodes.filter((contrib) => (
        contrib.committer && 
        contrib.committer.user && 
        contrib.committer.user.login.toLowerCase() === username.toLowerCase())
        ).map((_node) => {
          let con = {};
          con["datetime"] = _node.committedDate;
          con["repoNameWithOwner"] = repo.repository.nameWithOwner;
          con["repoUrl"] = repo.repository.url;
          con["additions"] = repo.repository.defaultBranchRef.target.additions;
          con["deletions"] = repo.repository.defaultBranchRef.target.deletions;
          con["changedFiles"] = repo.repository.defaultBranchRef.target.changedFiles;
          return con;
        });
        break;
      case "issue":
        yield repo.repository.issues.nodes.filter((contrib) => (
          contrib.author && 
          contrib.author.login && 
          contrib.author.login.toLowerCase() === username.toLowerCase())
        ).map((_node) => {
          let con = {};
          con["datetime"] = _node.createdAt;
          con["repoNameWithOwner"] = repo.repository.nameWithOwner;
          con["repoUrl"] = repo.repository.url;
          return con;
        });
        break;
      case "pullRequest":
        yield repo.repository.pullRequests.nodes.filter((contrib) => (
          contrib.author &&
          contrib.author.login &&
          contrib.author.login.toLowerCase() === username.toLowerCase())
        ).map((_node) => {
          let con = {};
          con["datetime"] = _node.createdAt;
          con["repoNameWithOwner"] = repo.repository.nameWithOwner;
          con["repoUrl"] = repo.repository.url;
          con["additions"] = _node.additions;
          con["deletions"] = _node.deletions;
          con["changedFiles"] = _node.changedFiles;
          return con;
        });
        break;
      default:
        break;
    }
  }
};

// Get an Array of Days from User Object
const getDaysArray = (objUser, keys) => {
  let days = [];
  keys.forEach((c) => {
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
const getYearsDict = (days) => {
  let years = {};
  days.forEach((day) => {
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
const fillPlatform = (objUser) => {
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
  nodes.forEach((_member) => {
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
const fillOrganization = (objUser) => {
  objUser.profile.organizations.edges.forEach((_org) => {
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

// Prepare data to call functions related to Stats
const fillStats = (objUser) => {
  let keys = Object.keys(objUser.calendar).filter((str) => {
    return str.match(/c[0-9]+/);
  });
  const days = getDaysArray(objUser, keys);
  const years = getYearsDict(days);

  Object.keys(years).forEach((y) => {
    const yearObj = years[parseInt(y)];
    const yearNum = y;
    const platformId = db.exec("SELECT id FROM platform").pop()["id"];

    db.exec(insert.statistic, [yearNum, platformId]);

    yearObj.forEach((day) => {
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
        new Date(streakStart),
        new Date(new Date(dayDate).getTime() - 24 * 60 * 60 * 1000),
        streakTotal,
        statisticId
      ]);
        streak = false;
        streakStart = "";
        streakTotal = 0;
      }
    });
  });
};

// Fill repository Table
const fillRepository = (_repo) => {
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
const fillRepoOwner = (_repo) => {
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
const fillLanguageSlice = (_repo) => {
  const pieId = db.exec("SELECT id FROM languagePie").pop()["id"];
  _repo.repository.languages.edges.forEach((_edge) => {
    const nodeName = _edge.node.name;
    const nodeSize = _edge.size;
    const nodeColor = _edge.node.color;
    db.exec(insert.languageSlice, [nodeName, nodeColor, nodeSize, pieId]);
  });
  fillRepoOwner(_repo);
};

// Fill languagePie Table
const fillPie = (reposi) => {
  reposi.forEach((_repo) => {
    if (
      db.exec("SELECT url from repository WHERE url=?", [
        _repo.repository.url
      ])[0] === undefined
    ) {
      const languagesCount = _repo.repository.languages.totalCount;
      const languagesSize = _repo.repository.languages.totalSize;
      db.exec(insert.languagePie, [languagesSize, languagesCount]);
      fillLanguageSlice(_repo);
    }
  });
};

// Prepare data to call Tables related to Repositories
const fillRepos = (objUser) => {
  let keys = Object.keys(objUser.calendar).filter((str) => {
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
  contribs.forEach((contrib) => {
    db.exec(insert.contrib, [
      contrib.datetime,
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
const fillCalendar = (objUser) => {
  let keys = Object.keys(objUser.calendar).filter((str) => {
    return str.match(/c[0-9]+/);
  });

  const user = db.exec("SELECT username FROM platform").pop()["username"];

  let commits = Array.from(genContributionsByRepositories(
    objUser.repoCommitHistory,
    "commit",
    user
  )).flat().reduce((h, obj) => {
    let date = obj.datetime.split("T")[0];
    return Object.assign(h, { [date]: (h[date] || []).concat(obj) });
  }, {});

  keys.forEach((c) => {
    const year = objUser.calendar[c.toString()];

    let pullRequest = Array.from(genContributionsByRepositories(
      year.issueContributionsByRepository,
      "issue",
      user
    )).flat().reduce((h, obj) => {
      let date = obj.datetime.split("T")[0];
      return Object.assign(h, { [date]: (h[date] || []).concat(obj) });
    }, {});

    let issues = Array.from(genContributionsByRepositories(
      year.pullRequestContributionsByRepository,
      "pullRequest",
      user
    )).flat().reduce((h, obj) => {
      let date = obj.datetime.split("T")[0];
      return Object.assign(h, { [date]: (h[date] || []).concat(obj) });
    }, {});

    let currentContributions = 0;
    let octoCats = [];
    for (const [w, week] of year.contributionCalendar.weeks.entries()) {
      for (const [d, day] of week.contributionDays.entries()) {
        const datetime = day.date;
        const date = datetime.split("T")[0];
        const week = w;
        const weekday = d;
        const total = day.contributionCount;
        const color = day.color;

        let count = total;


        if (total >= 0) {
          const platformId = db.exec("SELECT id FROM platform").pop()["id"];

          db.exec(insert.calendar, [
            date,
            week,
            weekday,
            total,
            color,
            platformId
          ]);
          const calendarId = db.exec("SELECT id FROM calendar").pop()["id"];

          if (commits[date]) {
            fillContribs(commits[date], "commit", calendarId);
            count -= commits[date].length;
            currentContributions += commits[date].length;
          }
          if (issues[date]) {
            fillContribs(issues[date], "issue", calendarId);
            count -= issues[date].length;
            currentContributions += issues[date].length;
          }
          if (pullRequest[date]) {
            fillContribs(pullRequest[date], "pullRequest", calendarId);
            count -= pullRequest[date].length;
            currentContributions += pullRequest[date].length;
          }

          if (count >= 0) {
            octoCats.push({
              datetime: new Date(datetime),
              total: count,
              calendarId
            });
          }
        }
      }
    }
    const addOctocat = (cat) => {
      let dDay = [];
        for (let index = 0; index < cat.total; index++) {
          dDay.push({
            datetime: cat.datetime,
            repoNameWithOwner: "octocat",
            repoUrl: "https://github.com/octocat",
            additions: 0,
            deletions: 0,
            changedFiles: 0,
          });
          currentContributions++;
        }
        fillContribs(dDay, "codeReviews", cat.calendarId);
    };

    octoCats.forEach((cat) => {
      if(currentContributions + cat.total < year.contributionCalendar.totalContributions){
        addOctocat(cat);
      }
    });
    let lastCat = octoCats[octoCats.length-1];
    lastCat.total = year.contributionCalendar.totalContributions - currentContributions;
    addOctocat(lastCat);
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
