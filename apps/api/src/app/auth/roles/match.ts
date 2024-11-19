export const matchRoles = (roles: Array<string>, userRoles: Array<string>) => {
  const rolesSet = new Set(roles);
  return userRoles.some((userRole) => rolesSet.has(userRole));
};
