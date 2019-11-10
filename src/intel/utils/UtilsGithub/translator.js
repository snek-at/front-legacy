import * as insert from "../../Database/Statements/Insert";
const alasql = require("alasql");

export const fillDB = objUser => {
  fillPlatform(objUser);
  fillOrganization(objUser);
  fillStats(objUser);
  fillRepos(objUser);
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

  alasql(insert.platform, [
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
    alasql(insert.member, [
      memberAvatarUrl,
      memberName,
      memberUsername,
      memberWebUrl
    ]);
    const member_id = alasql("SELECT id FROM member").pop()["id"];

    alasql(insert.organization_has_member, [orgId, member_id]);
  });
};

const fillOrganization = objUser => {
  objUser.profile.organizations.edges.forEach(_org => {
    const avatarUrl = _org.node.avatarUrl;
    const name = _org.node.name;
    const url = _org.node.url;
    alasql(insert.organization, [avatarUrl, name, url]);

    const organization_id = alasql("SELECT id FROM organization").pop()["id"];
    const platform_id = alasql("SELECT id FROM platform").pop()["id"];

    alasql(insert.platform_has_organization, [platform_id, organization_id]);
    fillOrgMembers(_org.node.membersWithRole.nodes, organization_id);
  });
};

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
    } else if (streakTotal != 0) {
      const statisticId = alasql("SELECT id FROM statistic").pop()["id"];
      alasql(insert.streak, [
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
  const busiestDayId = alasql("SELECT id FROM busiestDay").pop()["id"];
  const platformId = alasql("SELECT id FROM platform").pop()["id"];
  alasql(insert.statistic, [yearNum, busiestDayId, platformId]);
  fillStreak(year);
};

const fillBusiestDay = years => {
  Object.keys(years).forEach(y => {
    const year = years[y];
    const busiestDay = getBusiestDay(year);
    const busiestDayDate = busiestDay.date;
    const busiestDayCount = busiestDay.contributionCount;

    alasql(insert.busiestDay, [busiestDayDate, busiestDayCount]);
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
  const repoOwnerId = alasql("SELECT id FROM member").pop()["id"];
  const name = _repo.repository.name;
  const repoUrl = _repo.repository.url;
  const pieId = alasql("SELECT id FROM languagePie").pop()["id"];
  alasql(insert.repository, [repoUrl, name, repoOwnerId, pieId]);
  const repoId = alasql("SELECT id FROM repository").pop()["id"];
  const platformId = alasql("SELECT id FROM platform").pop()["id"];
  alasql(insert.platform_has_repository, [platformId, repoId]);
};

const fillRepoOwner = _repo => {
  const repoOwnerUsername = _repo.repository.owner.login;
  const repoOwnerAvatarUrl = _repo.repository.owner.avatarUrl;
  const repoOwnerName = _repo.repository.owner.name;
  const repoOwnerUrl = _repo.repository.owner.url;
  alasql(insert.member, [
    repoOwnerAvatarUrl,
    repoOwnerName,
    repoOwnerUsername,
    repoOwnerUrl
  ]);
  fillRepository(_repo);
};

const fillLanguageSlice = _repo => {
  const pieId = alasql("SELECT id FROM languagePie").pop()["id"];
  _repo.repository.languages.edges.forEach(_edge => {
    const nodeName = _edge.node.name;
    const nodeSize = _edge.size;
    const nodeColor = _edge.node.color;
    alasql(insert.languageSlice, [nodeName, nodeColor, nodeSize, pieId]);
  });
  fillRepoOwner(_repo);
};

const fillPie = reposi => {
  reposi.forEach(_repo => {
    if (
      alasql("SELECT url from repository WHERE url=?", [
        _repo.repository.url
      ])[0] == null
    ) {
      const languagesCount = _repo.repository.languages.totalCount;
      const languagesSize = _repo.repository.languages.totalSize;
      alasql(insert.languagePie, [languagesSize, languagesCount]);
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
    alasql(insert.contrib, [
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

//> Helper functions
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

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
