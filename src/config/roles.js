const allRoles = {
  user: ['getNotifications', 'getFormTypes', 'getForms', 'getRegulations'],
  admin: [
    'getUsers',
    'manageUsers',
    'manageNotifications',
    'getNotifications',
    'manageFormTypes',
    'getFormTypes',
    'manageForms',
    'getForms',
    'getRegulations',
    'manageRegulations',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
