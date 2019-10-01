import * as create from './Statements/Create';
var alasql = require('alasql');
export function Database(db_name) {
    let db = new alasql.Database(db_name);

    db.exec(init_tables);
    console.log(init_tables);

    return db;
}

const init_tables = `
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
    ${create.organization_has_member}
    ${create.repository_has_member}
    ${create.platform_has_organization}
    ${create.platform_has_repository}
`;