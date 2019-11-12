import * as insert from "../../Database/Statements/Insert";
import * as webscrap from "../UtilsWebscrap";
let db;

//> Fill functions
// Fill the platform table with data
const fillPlatform = async user => {
  const url = `https://${user.server}/${user.username}`;
  const html = await webscrap.parseTextToDOM(
    webscrap.fetchHtml(url).then(html => {
      return html;
    })
  );
  const status = html.getElementsByTagName("gl-emoji")[0];
  const coverDesc = html
    .getElementsByClassName("cover-desc")[0]
    .getElementsByTagName("span");

  const coverTitle = html.getElementsByClassName("cover-title")[0];
  let avatarUrl = html
    .getElementsByClassName("avatar-holder")[0]
    .getElementsByTagName("a")[0]
    .getAttribute("href");
  const links = html.getElementsByClassName("profile-link-holder")[0];
  const message = null;
  const emojiHTML = null;
  const fullName = coverDesc[0].innerHTML.trim().substring(1);
  const date = coverDesc[1].innerHTML;

  if (avatarUrl) {
    if (!avatarUrl.includes("https://") || !avatarUrl.includes("http://")) {
      avatarUrl = `https://${user.server}/${avatarUrl.substring(
        1
      )}`;
    }
  }

  const createdAt = new Date(date);

  db.exec(insert.platform, [
    user.platformName,
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
    webscrap.fetchJson(url).then(html => {
      return html;
    })
  );

  const rows = html.getElementsByClassName("group-row");

  for (const _org of Array.from(rows)) {
    const avatarUrl = _org
      .getElementsByClassName("avatar")[0]
      .getAttribute("data-src");
    const name = _org
      .getElementsByClassName("group-name")[0]
      .getAttribute("href").substring(1);
    let orgUrl = `https://${user.server}/${name}`;

    if (avatarUrl) {
      if (!avatarUrl.includes("https://") || !avatarUrl.includes("http://")) {
        avatarUrl = `https://${user.server}/${avatarUrl.substring(
          1
        )}`;
      }
    }

    db.exec(insert.organization, [
      avatarUrl,
      name,
      orgUrl
    ]);
    
    var id_platform = db.exec('SELECT id FROM platform').pop()["id"]
    var id_organization = db.exec('SELECT id FROM organization').pop()["id"]

    db.exec(insert.platformHasOrganization, [
      id_platform,
      id_organization
    ]);

  }
};

//> Export functions
// Fill the Database from user object

export const fill = (_db, user) => {
  db = _db;
  return fillPlatform(user).then(async()=>
    await fillOrganizations(user)
  );
};
