import * as insert from "../../Database/Statements/Insert";
const alasql = require("alasql");

export const fillDB = objUser => {
  fillPlatform(objUser);
  fillOrganization(objUser);
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
