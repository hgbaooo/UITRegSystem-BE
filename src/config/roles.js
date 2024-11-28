const allRoles = {
  user: ['getNotifications'],
  admin: ['getUsers', 'manageUsers', 'manageNotifications', 'getNotifications'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
