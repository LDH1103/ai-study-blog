export const toSitePath = (baseUrl: string, path: string) => {
  const siteBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${siteBase}${path.replace(/^\//, '')}`;
};
