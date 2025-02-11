//> Database
// Insert statements
import * as insert from "../../Database/Statements/Insert";
// Update statements
import * as update from "../../Database/Statements/Update";
// Get html data from websites
import * as webscrap from "../UtilsWebscrap";
let db;

//> Helper functions
// Get calendar week from date
Date.prototype.getWeekNumber = function() {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
};

//> Fill functions
// Fill the platform table with data
const fillPlatform = async (user) => {
  const url = `https://${user.server}/${user.username}`;
  const html = await webscrap.parseTextToDOM(
    webscrap.fetchHtml(url).then((html) => {
      return html;
    })
  );

  const userInfo = html.getElementsByClassName("user-info")[0];
  const fullName = html.getElementsByClassName("cover-title")[0].innerText;

  let avatarUrl = html
    .getElementsByClassName("avatar-holder")[0]
    .getElementsByTagName("a")[0]
    .getAttribute("href");

  const links = html.getElementsByClassName("profile-link-holder")[0];
  const message = html.getElementsByTagName("gl-emoji")[0];
  const emojiHTML = null;
  const date = new Date(userInfo.getElementsByTagName("span")[1].innerText.split(" ").slice(2).join(" "));

  if (avatarUrl) {
    if (!avatarUrl.includes("https://") || !avatarUrl.includes("http://")) {
      avatarUrl = `https://${user.server}/${avatarUrl.substring(1)}`;
    }
  }

  const createdAt = new Date(date);

  db.exec(insert.platform, [
    user.source,
    url,
    avatarUrl,
    null,
    null,
    null,
    user.username,
    fullName,
    createdAt,
    null,
    message,
    emojiHTML
  ]);
};

const fillOrganizations = async (user) => {
  const url = `https://${user.server}/users/${user.username}/groups.json`;
  const html = await webscrap.parseJsonToDOM(
    webscrap.fetchJson(url).then((html) => {
      return html;
    })
  );

  const rows = html.getElementsByClassName("group-row");

  for (const _org of Array.from(rows)) {
    let avatarUrl = _org
      .getElementsByClassName("avatar")[0]
      .getAttribute("data-src");

    const name = _org
      .getElementsByClassName("group-name")[0]
      .getAttribute("href")
      .substring(1);

    let orgUrl = `https://${user.server}/${name}`;

    if (avatarUrl) {
      if (!avatarUrl.includes("https://") || !avatarUrl.includes("http://")) {
        avatarUrl = `https://${user.server}/${avatarUrl.substring(1)}`;
      }
    }

    db.exec(insert.organization, [avatarUrl, name, orgUrl]);

    var idPlatform = db.exec("SELECT id FROM platform").pop()["id"];
    var idOrganization = db.exec("SELECT id FROM organization").pop()["id"];

    db.exec(insert.platformHasOrganization, [idPlatform, idOrganization]);
  }
};

const fillRepositories = (user, nameWithOwner) => {
  let repository = {};
  repository.repoUrl = `https://${user.server}/${nameWithOwner}`;
  repository.avatarUrl = `https://${user.server}/${nameWithOwner}/-/avatar`;
  repository.name = nameWithOwner;
  repository.ownerId = db.exec("SELECT id FROM member").pop();
  repository.languagePieId = db.exec("SELECT id FROM languagePie").pop();

  if(repository.ownerId){
    repository.ownerId = repository.ownerId.id;
  }

  if(repository.languagePieId){
    repository.languagePieId = repository.languagePieId.id;
  }

  const repoExists = db.exec(
    `SELECT id FROM repository WHERE name="${repository.name}"`
  );
  if (repoExists === undefined || repoExists.length === 0) {
    db.exec(insert.repository, [
      repository.avatarUrl,
      repository.repoUrl,
      repository.name,
      repository.ownerId,
      repository.languagePieId
    ]);

    const platformId = db.exec("SELECT id FROM platform").pop()["id"];
    const repositoryId = db.exec("SELECT id FROM repository").pop()["id"];

    db.exec(insert.platformHasRepository, [platformId, repositoryId]);
  }
  return repository;
};

const fillContribution = (user, item) => {
  let type;
  if (item.innerHTML.includes("pushed to branch")) {
    type = "commit";
  } else if (item.innerHTML.includes("opened")) {
    type = "issue";
  } else if (item.innerHTML.includes("Merge branch")) {
    type = "pullRequest";
  }

  let datetime = item.getElementsByTagName("time")[0].getAttribute("datetime");
  datetime = new Date(datetime);

  let nameWithOwner = item
    .getElementsByClassName("event-scope")[0]
    .getElementsByTagName("a")[0]
    .getAttribute("href");
    
  nameWithOwner = nameWithOwner.substring(1);

  const repository = fillRepositories(user, nameWithOwner);
  const calendarId = db.exec("SELECT id FROM calendar").pop()["id"];

  db.exec(insert.contrib, [
    datetime,
    nameWithOwner,
    repository.repoUrl,
    null,
    null,
    null,
    type,
    calendarId
  ]);
};

const fillStreaks = (contribs) => {
  contribs.sort((a,b) => (a.datetime > b.datetime) ? 1 : -1);

  const uniqueContribs = Array.from(new Set(contribs.map((a) => a.datetime.toISOString().split("T")[0])))
  .map((datetime) => {
    return contribs.find((a) => a.datetime.toISOString().split("T")[0] === datetime);
  });

  let streak = false;
  let count;
  let dateFrom;

  for(let i = 0; i < uniqueContribs.length; i++) {
    const prevDay = new Date(uniqueContribs[i].datetime.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    if(i>0) {
      if(prevDay === uniqueContribs[i-1].datetime.toISOString().split("T")[0]) {
        if(!streak){
          dateFrom = uniqueContribs[i-1].datetime.toISOString().split("T")[0];
          count = 2;
          streak = true;
        }
        else {
          count++;
        }
      }
      else if(count > 0) {
        const statisticId = db.exec(`SELECT id FROM statistic WHERE year=${new Date(dateFrom)
          .getFullYear()}`)
          .pop()["id"];

        db.exec(insert.streak, [
          new Date(dateFrom),
          new Date(uniqueContribs[i-1].datetime.toISOString().split("T")[0]),
          count,
          statisticId
        ]);

        streak = false;
        count = 0;
        dateFrom = null;
      }
    }
  }
};

const fillCalendar = async (user) => {
  const limit = "2147483647";
  const url = `https://${user.server}/${user.username}?limit=${limit}`;

  const html = await webscrap.parseJsonToDOM(
    webscrap.fetchJson(url).then((html) => {
      return html;
    })
  );

  const activities = html.getElementsByClassName("event-item");
  for (const item of Array.from(activities)) {
    if (
      item.innerHTML.includes("pushed to branch") ||
      item.innerHTML.includes("opened") ||
      item.innerHTML.includes("Merge branch")
    ) {
      let datetime = item
        .getElementsByTagName("time")[0]
        .getAttribute("datetime");
      datetime = new Date(datetime);
      let date = `${datetime.getFullYear()}-${datetime.getMonth()+1}-${datetime.getDate()}`;
      let week = datetime.getWeekNumber().toString();
      let weekday = datetime.getDay().toString();

      const platformId = db.exec("SELECT id FROM platform").pop()["id"];
      const statYears = db.exec("SELECT year FROM statistic");
      let year = datetime.getFullYear();

      const uniqueYears = Array.from(new Set(statYears.map((a) => a.year)));
      
      if(!uniqueYears.includes(year)) {
        db.exec(insert.statistic, [year,platformId]);
      }

      let res = db
        .exec(`SELECT total FROM calendar WHERE date="${date}"`)
        .pop();
      if (res === undefined || res.length === 0) {
        db.exec(insert.calendar, [date, week, weekday, 1, null, platformId]);
      } else {
        let total = res.total;
        total++;
        db.exec(update.calendarTotal, [total, date, platformId]);
      }

      fillContribution(user, item);
    }
  }
  fillStreaks(db.exec("SELECT * FROM contrib"));
};

//> Export functions
// Fill the Database from user object
export const fill = (_db, user) => {
  db = _db;
  return fillPlatform(user).then(
    async () => await fillOrganizations(user).then(await fillCalendar(user))
  );
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
