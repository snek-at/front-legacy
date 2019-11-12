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
  }
};

//> Export functions
// Fill the Database from user object
export const fill = (_db, user) => {
  db = _db;
  return fillPlatform(user);
};