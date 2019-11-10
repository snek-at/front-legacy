import * as insert from "../../Database/Statements/Insert";
const alasql = require("alasql");

export const fillDB = objUser => {
  fillPlatform(objUser);
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

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
