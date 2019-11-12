export const calendarTotal = `
UPDATE calendar
SET total = ?
WHERE date = ? AND platform_id = ?
`;