const allRoles = {
  user: ['getNotifications', 'getFormTypes', 'getForms'],
  admin: [
    'getUsers',
    'manageUsers',
    'manageNotifications',
    'getNotifications',
    'manageFormTypes',
    'getFormTypes',
    'manageForms',
    'getForms',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
