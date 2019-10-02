import * as create from "./Statements/Create";
var alasql = require("alasql");

const initTables = `
    ${create.platform}
    ${create.organization}
    ${create.member}
    ${create.languagePie}
    ${create.repository}
    ${create.languageSlice}
    ${create.busiestDay}
    ${create.statistic}
    ${create.streak}
    ${create.calendar}
    ${create.contrib}
    ${create.organizationHasMember}
    ${create.repositoryHasMember}
    ${create.platformHasOrganization}
    ${create.platformHasRepository}
`;

export function Database(dbName) {
    let db = new alasql.Database(dbName);

    db.exec(initTables);

    return db;
}
