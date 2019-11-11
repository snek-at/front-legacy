import * as insert from "../../Database/Statements/Insert";
let db;
let streak = false;
let streakStart = "";
let streakTotal = 0;

export const fillDB = (_db, objUser) => {
  db = _db;
  fillPlatform(objUser);
  fillOrganization(objUser);
  fillStats(objUser);
  fillRepos(objUser);
  fillCalendar(objUser);
};

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

  db.exec(insert.platform, [
    "GitHub",
    "https://github.com",
    avatarUrl,
    websiteUrl,
    company,
    email,
    fullName,
    createdAt,
    location,
    statusMessage,
    statusEmojiHTML
  ]);
};

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
    const member_id = db.exec("SELECT id FROM member").pop()["id"];

    db.exec(insert.organizationHasMember, [orgId, member_id]);
  });
};

const fillOrganization = objUser => {
  objUser.profile.organizations.edges.forEach(_org => {
    const avatarUrl = _org.node.avatarUrl;
    const name = _org.node.name;
    const url = _org.node.url;
    db.exec(insert.organization, [avatarUrl, name, url]);

    const organization_id = db.exec("SELECT id FROM organization").pop()["id"];
    const platform_id = db.exec("SELECT id FROM platform").pop()["id"];

    db.exec(insert.platformHasOrganization, [platform_id, organization_id]);
    fillOrgMembers(_org.node.membersWithRole.nodes, organization_id);
  });
};

const fillStreak = year => {
  year.forEach(day => {
    const dayTotal = day.contributionCount;
    const dayDate = day.date;

    if (dayTotal != 0) {
      if (!streak) {
        streak = true;
        streakStart = dayDate;
        streakTotal = dayTotal;
      } else {
        streakTotal += dayTotal;
      }
    } else if (streakTotal != 0) {
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

const fillStatistic = (year, busiestDayDate) => {
  const yearNum = new Date(busiestDayDate).getFullYear();
  const busiestDayId = db.exec("SELECT id FROM busiestDay").pop()["id"];
  const platformId = db.exec("SELECT id FROM platform").pop()["id"];
  db.exec(insert.statistic, [yearNum, busiestDayId, platformId]);
  fillStreak(year);
};

const fillBusiestDay = years => {
  Object.keys(years).forEach(y => {
    const year = years[y];
    const busiestDay = getBusiestDay(year);
    const busiestDayDate = busiestDay.date;
    const busiestDayCount = busiestDay.contributionCount;

    db.exec(insert.busiestDay, [busiestDayDate, busiestDayCount]);
    fillStatistic(year, busiestDayDate);
  });
};

const fillStats = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  const days = getDaysArray(objUser, keys);
  const years = getYearsDict(days);
  fillBusiestDay(years);
};

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

const fillRepos = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  keys.forEach(c => {
    const reposi = objUser.calendar[c].commitContributionsByRepository;
    fillPie(reposi);
  });
};

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

const fillCalendar = objUser => {
  let keys = Object.keys(objUser.calendar).filter(str => {
    return str.match(/c[0-9]+/);
  });
  keys.forEach(c => {
    const year = objUser.calendar[c];
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
        const commits = getContributionsByRepositories(
          year.commitContributionsByRepository
        );
        const issues = getContributionsByRepositories(
          year.issueContributionsByRepository
        );
        const pullRequests = getContributionsByRepositories(
          year.pullRequestContributionsByRepository
        );
        const calendarId = db.exec("SELECT id FROM calendar").pop()["id"];

        fillContribs(commits, "commit", calendarId);
        fillContribs(issues, "issue", calendarId);
        fillContribs(pullRequests, "pullRequest", calendarId);
      }
    }
  });
};

//> Helper functions
const getContributionsByRepositories = contributionsByRepository => {
  let contribs = [];
  contributionsByRepository.forEach(repo => {
    const repoNameWithOwner = repo.repository.nameWithOwner;
    const repoUrl = repo.repository.url;
    repo.repository.defaultBranchRef.target.history.edges.forEach(edge => {
      let contrib = {};
      const date = edge.node.committedDate.split("T")[0];
      contrib["date"] = date;
      contrib["repoNameWithOwner"] = repoNameWithOwner;
      contrib["repoUrl"] = repoUrl;
      contrib["additions"] = edge.node.additions;
      contrib["deletions"] = edge.node.deletions;
      contrib["changedFiles"] = edge.node.changedFiles;
      contribs.push(contrib);
    });
  });
  return contribs;
};
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

const getDaysArray = (objUser, keys) => {
  let days = [];
  keys.forEach(c => {
    const year = objUser.calendar[c];
    for (const [w, week] of year.contributionCalendar.weeks.entries()) {
      for (const [d, day] of week.contributionDays.entries()) {
        days.push(day);
      }
    }
  });
  return days;
};

const getYearsDict = days => {
  let years = {};
  days.forEach(day => {
    const year = new Date(day.date).getFullYear();
    if (years[year] == undefined) {
      years[year] = [];
    }
    years[year].push(day);
  });
  return years;
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
