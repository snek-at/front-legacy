export const platform = `
SELECT * FROM platform
`

export const organization = `
SELECT
  member.id as mId,
  member.avatarUrl as mAvatarUrl,
  member.name as mName,
  member.username as mUsername,
  member.url as mUrl,
  organization.id as oId,
  organization.avatarUrl as oAvatarUrl,
  organization.name as oName,
  organization.url as oUrl
FROM
  organization
LEFT OUTER JOIN
  organization_has_member
    ON organization.id = organization_has_member.organization_id
LEFT OUTER JOIN
  member
    ON member.id = organization_has_member.member_id
`

export const repository = `
SELECT
  repository.id as rId,
  repository.avatarUrl as rAvatarUrl,
  repository.name as rName,
  repository.languagePie_id as rLanguagePieId,
  owner.avatarUrl as oAvatarUrl,
  owner.name as oName,
  owner.username as oUsername,
  owner.url as oUrl,

  languagePie.id as lId,
  languagePie.size as lSize,
  languagePie.total as lTotal,
  languageSlice.id as sId,
  languageSlice.color as sColor,
  languageSlice.name as sName,
  languageSlice.size as sSize,
  languageSlice.pie_id as sPieId
FROM
  repository
LEFT OUTER JOIN 
  member as owner
    ON owner.id = repository.owner_id
LEFT OUTER JOIN
    languagePie
      ON languagePie.id = repository.languagePie_id
LEFT OUTER JOIN 
  languageSlice
      ON languageSlice.pie_id = languagePie.id
LEFT OUTER JOIN
  repository_has_member
    ON repository.id = repository_has_member.repository_id
LEFT OUTER JOIN
  member
    ON member.id = repository_has_member.member_id
`

export const language = `
SELECT
  languageSlice.id as sId,
  languageSlice.color as sColor,
  languageSlice.name as sName,
  languageSlice.size as sSize,
  languageSlice.pie_id as sPieId
FROM
  languageSlice
`;

export const totalLanguageSize = `
SELECT
  sum(languageSlice.size) as num
FROM
  languageSlice
`;


export const calendar = `
SELECT
  calendar.id as cId,
  calendar.date as cDate,
  YEAR(contrib.datetime) as cYear,
  calendar.week as cWeek,
  calendar.weekday as cWeekday,
  calendar.color as cColor,
  contrib.id as ctId,
  contrib.datetime as ctDatetime,
  contrib.nameWithOwner as ctNameWithOwner,
  contrib.repoUrl as ctRepoUrl,
  contrib.additions as ctAdditions,
  contrib.deletions as ctDeletions,
  contrib.changedFiles as ctChangedFiles,
  contrib.type as ctType
FROM
  calendar
JOIN
  contrib
    ON calendar.id = contrib.calendar_id

`;

export const totalContributions = `
SELECT
  count(contrib.id) as num
FROM
  contrib
WHERE
  YEAR(contrib.datetime) = ?
`;

export const baseYearOfPlatforms = `
SELECT 
  MIN(YEAR(createdAt)) as baseYear
FROM
  platform
`;
