/** Extracts the post slug from a glob-loader entry ID like "honeymoon/003-xxx/index" */
export function postSlugFromId(id: string): string {
  const parts = id.split('/');
  // ID format: [trip-slug]/[post-slug]/index
  return parts[1] ?? parts[0];
}
