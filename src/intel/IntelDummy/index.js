import * as insert from "../Database/Statements/Insert";
import { Database } from "../Database";
var faker = require("faker");

let db = new Database("dummy");

const count = table => db.exec(`SELECT COUNT(*) FROM ${table}`)[0]["COUNT(*)"];
const random = base => Math.floor(Math.random() * base) + 1;
const randomBtw = (max, min) =>
  Math.floor(Math.random() * (+max - +min)) + +min;

const createDummy = (table, entries, c) => {
  if (c) {
    try {
      for (let index = 0; index < c; index++) {
        let entriesResolved = entries.map(entry =>
          typeof entry == "function" ? entry() : entry
        );
        db.exec(table, entriesResolved);
      }
    } catch (e) {
      if (
        e.message ===
          "Cannot insert record, because it already exists in primary key index" ||
        e.message ===
          "Cannot insert record, because it already exists in unique index"
      ) {
        //console.warn(e.message);
      } else {
        throw e;
      }
    }
  }
};

export const exec = value => {
  return db.exec(value);
};

export function fill(user) {
  createDummy(
    insert.platform,
    [
      "GitHub",
      faker.internet.url,
      faker.internet.avatar,
      faker.internet.url,
      "schettnet",
      faker.internet.email,
      faker.internet.userName,
      faker.internet.userName,
      faker.date.recent,
      faker.address.streetAddress,
      "Status",
      "StatusHTML"
    ],
    3
  );
  createDummy(
    insert.organization,
    [faker.internet.avatar, faker.internet.url, faker.internet.userName],
    20
  );
  createDummy(
    insert.member,
    [
      faker.internet.avatar,
      faker.name.findName,
      faker.internet.userName,
      faker.internet.url
    ],
    20
  );
  createDummy(
    insert.languagePie,
    [
      function() {
        return randomBtw(1000, 2000);
      },
      function() {
        return randomBtw(1000, 2000);
      }
    ],
    20
  );
  createDummy(
    insert.repository,
    [
      faker.internet.avatar,
      faker.internet.userName,
      function() {
        return random(count("member"));
      },
      function() {
        return random(count("languagePie"));
      }
    ],
    20
  );
  createDummy(
    insert.languageSlice,
    [
      function() {
        let types = ["CSS", "HTML", "JavaScript"];
        return types[Math.floor(Math.random() * types.length)];
      },
      "#FFFFFF",
      function() {
        return randomBtw(1000, 2000);
      },
      function() {
        return random(count("languagePie"));
      }
    ],
    20
  );
  createDummy(
    insert.busiestDay,
    [
      faker.date.recent,
      function() {
        return randomBtw(1000, 2000);
      }
    ],
    20
  );
  createDummy(
    insert.statistic,
    [
      function() {
        return randomBtw(2001, 2019);
      },
      function() {
        return random(count("busiestDay"));
      },
      function() {
        return random(count("platform"));
      }
    ],
    2
  );
  createDummy(
    insert.calendar,
    [
      faker.date.recent,
      function() {
        return randomBtw(0, 53);
      },
      function() {
        return randomBtw(0, 6);
      },
      function() {
        return randomBtw(200, 3232);
      },
      "#FFFFFFF",
      function() {
        return random(count("platform"));
      }
    ],
    300
  );
  createDummy(
    insert.contrib,
    [
      faker.date.recent,
      faker.internet.userName,
      faker.internet.url,
      function() {
        return randomBtw(20, 2000);
      },
      function() {
        return randomBtw(10, 2323);
      },
      function() {
        return randomBtw(1, 50);
      },
      function() {
        let types = ["commit", "pullRequest", "issue"];
        return types[Math.floor(Math.random() * types.length)];
      },
      function() {
        return random(count("calendar"));
      }
    ],
    22
  );
  createDummy(
    insert.streak,
    [
      faker.date.recent,
      faker.date.recent,
      function() {
        return randomBtw(213, 500);
      },
      function() {
        return random(count("statistic"));
      }
    ],
    20
  );

  createDummy(
    insert.platformHasOrganization,
    [
      function() {
        return random(count("platform"));
      },
      function() {
        return random(count("organization"));
      }
    ],
    20
  );

  createDummy(
    insert.organizationHasMember,
    [
      function() {
        return random(count("organization"));
      },
      function() {
        return random(count("member"));
      }
    ],
    20
  );
  createDummy(
    insert.platformHasRepository,
    [
      function() {
        return random(count("platform"));
      },
      function() {
        return random(count("repository"));
      }
    ],
    20
  );
  createDummy(
    insert.repositoryHasMember,
    [
      function() {
        return random(count("repository"));
      },
      function() {
        return random(count("member"));
      }
    ],
    20
  );
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
