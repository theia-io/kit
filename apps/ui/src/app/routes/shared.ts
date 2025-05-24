export const pathWithAppPrefix = (path: string) =>
  path.split('app').slice(1).join('').slice(1);

export const pages = import('@kitouch/pages');
