export const platform = `
INSERT INTO platform(
    platformName,
    platformUrl,
    avatarUrl,
    websiteUrl,
    company,
    email,
    username,
    fullName,
    createdAt,
    location,
    statusMessage,
    statusEmojiHTML
)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?);
`;

export const organization = `
INSERT INTO organization(
    avatarUrl,
    name,
    url,
    description,
    location
)
VALUES (?,?,?,?,?);
`;

export const member = `
INSERT INTO member(
    avatarUrl,
    name,
    username,
    url
)
VALUES (?,?,?,?);
`;

export const languagePie = `
INSERT INTO languagePie(
    size,
    total
)
VALUES (?,?);
`;

export const repository = `
INSERT INTO repository(
    avatarUrl,
    url,
    name,
    owner_id,
    languagePie_id
)
VALUES (?,?,?,?,?);
`;

export const languageSlice = `
INSERT INTO languageSlice(
    name,
    color,
    size,
    pie_id
)
VALUES (?,?,?,?);
`;

export const statistic = `
INSERT INTO statistic(
    year,
    platform_id
)
VALUES (?,?);
`;

export const streak = `
INSERT INTO streak(
    startDate,
    endDate,
    total,
    statistic_id
)
VALUES (?,?,?,?);
`;

export const calendar = `
INSERT INTO calendar(
    date,
    week,
    weekday,
    total,
    color,
    platform_id
)
VALUES (?,?,?,?,?,?);
`;

export const contrib = `
INSERT INTO contrib(
    datetime,
    nameWithOwner,
    repoUrl,
    additions,
    deletions,
    changedFiles,
    type,
    calendar_id
)
VALUES (?,?,?,?,?,?,?,?);
`;

export const platformHasOrganization = `
INSERT INTO platform_has_organization(
    platform_id,
    organization_id
)
VALUES (?,?);
`;

export const platformHasRepository = `
INSERT INTO platform_has_repository(
    platform_id,
    repository_id
)
VALUES (?,?);
`;

export const organizationHasMember = `
INSERT INTO organization_has_member(
    organization_id,
    member_id
)
VALUES (?,?);
`;

export const repositoryHasMember = `
INSERT INTO repository_has_member(
    repository_id,
    member_id
)
VALUES (?,?);
`;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
