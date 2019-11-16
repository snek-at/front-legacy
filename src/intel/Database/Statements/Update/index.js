export const calendarTotal = `
UPDATE calendar
SET total = ?
WHERE date = ? AND platform_id = ?
`;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
