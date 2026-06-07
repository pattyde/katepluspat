/**
 * Reads subtitles.json from the archive and injects subtitle: into each post's front matter.
 * Archive key format: "katepluspat/posts/NNN-slug"
 * Content path:       src/content/posts/[trip-slug]/NNN-slug/index.md
 */

import fs from 'fs';

const SUBTITLES = JSON.parse(
  fs.readFileSync('/Users/patrick/code/travel-blog-archive/scripts/subtitles.json', 'utf8')
);

const TRIP_MAP = {
  'katepluspat':     'honeymoon',
  'katepluspat2023': 'europe-2023',
  'katepluspat2024': 'europe-2024',
};

let applied = 0, skipped = 0, missing = 0;

for (const [archiveKey, subtitle] of Object.entries(SUBTITLES)) {
  if (!subtitle) { skipped++; continue; }

  // Parse "katepluspat/posts/NNN-slug"
  const [tripDir, , postSlug] = archiveKey.split('/');
  const tripSlug = TRIP_MAP[tripDir];
  if (!tripSlug) { console.error(`Unknown trip dir: ${tripDir}`); continue; }

  const postPath = `/Users/patrick/code/travel-blog/src/content/posts/${tripSlug}/${postSlug}/index.md`;
  if (!fs.existsSync(postPath)) { console.error(`Missing: ${postPath}`); missing++; continue; }

  const raw = fs.readFileSync(postPath, 'utf8');
  const parts = raw.split('---', 3);   // ["", fm, body]
  if (parts.length < 3) { console.error(`Bad front matter: ${postPath}`); continue; }

  const [, fm, body] = parts;

  // Skip if subtitle already present
  if (/^subtitle:/m.test(fm)) { skipped++; continue; }

  // Escape any double-quotes in the subtitle
  const escaped = subtitle.replace(/"/g, '\\"');

  // Insert subtitle: after the title: line
  const newFm = fm.replace(/^(title:.*$)/m, `$1\nsubtitle: "${escaped}"`);

  fs.writeFileSync(postPath, `---${newFm}---${body}`);
  applied++;
}

console.log(`Applied: ${applied}  Skipped (empty): ${skipped}  Missing files: ${missing}`);
