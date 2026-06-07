/**
 * Import script: transforms Travellerspoint archive into Astro content collections.
 *
 * Source layout:
 *   travel-blog-archive/
 *     katepluspat/           → trip slug: honeymoon
 *     katepluspat2023/       → trip slug: europe-2023
 *     katepluspat2024/       → trip slug: europe-2024
 *
 * Each trip has:
 *   index.md                 → ordered post list (parsed for ordering only)
 *   posts/NNN-slug.md        → post content with YAML front matter
 *   images/NNN-slug/         → image files
 *
 * Output layout:
 *   src/content/posts/[trip-slug]/[post-slug]/index.md
 *   src/content/posts/[trip-slug]/[post-slug]/images/
 *
 * Front matter transforms:
 *   - images[].url  → images[].path  (renamed field)
 *   - adds trip slug
 *   - strips source_url
 *   - rewrites body image refs: ../images/NNN-slug/file → ./images/file
 */

import fs from 'fs';
import path from 'path';

const ARCHIVE = '/Users/patrick/code/travel-blog-archive';
const DEST = '/Users/patrick/code/travel-blog/src/content/posts';

const TRIPS = [
  { dir: 'katepluspat',     slug: 'honeymoon' },
  { dir: 'katepluspat2023', slug: 'europe-2023' },
  { dir: 'katepluspat2024', slug: 'europe-2024' },
];

let imported = 0;
let errors = 0;
const missingImages = [];

for (const trip of TRIPS) {
  const srcDir = path.join(ARCHIVE, trip.dir);
  const postsDir = path.join(srcDir, 'posts');
  const imagesDir = path.join(srcDir, 'images');
  const destTripDir = path.join(DEST, trip.slug);

  fs.mkdirSync(destTripDir, { recursive: true });

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const postSlug = file.replace(/\.md$/, '');
    const srcFile = path.join(postsDir, file);
    const raw = fs.readFileSync(srcFile, 'utf8');

    // Split front matter from body
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) {
      console.error(`  ✗ No front matter: ${file}`);
      errors++;
      continue;
    }

    let fm = fmMatch[1];
    let body = fmMatch[2];

    // Rename images[].url to images[].path for local images, strip remote-URL entries
    fm = fm.replace(/^(\s*-\s*)url: "\.\.\/images\/[^/]+\//gm, '$1path: "./images/');
    fm = fm.replace(/^(\s*)path: "\.\.\/images\/[^/]+\//gm, '$1path: "./images/');

    // Strip any remaining `- url: "https://..."` entries (no local file) and record them
    fm = fm.replace(/^(\s*-\s*)url: "(https?:\/\/[^"]+)"[^\n]*\n(\s*caption:[^\n]*\n)?/gm, (match, _indent, remoteUrl) => {
      missingImages.push({ post: `${trip.slug}/${postSlug}`, url: remoteUrl });
      return '';
    });

    // Remove source_url line
    fm = fm.replace(/^source_url:.*\n?/m, '');

    // Add trip field after author (or after date if no author)
    if (!fm.includes('\ntrip:')) {
      fm = fm.replace(/(^author:.*$)/m, `$1\ntrip: "${trip.slug}"`);
      if (!fm.includes('\ntrip:')) {
        fm = fm.replace(/(^date:.*$)/m, `$1\ntrip: "${trip.slug}"`);
      }
    }

    // Rewrite body image refs: ../images/NNN-slug/file → ./images/file
    body = body.replace(/\.\.\/images\/[^/]+\//g, './images/');

    const destPostDir = path.join(destTripDir, postSlug);
    fs.mkdirSync(destPostDir, { recursive: true });

    const destFile = path.join(destPostDir, 'index.md');
    fs.writeFileSync(destFile, `---\n${fm.trim()}\n---\n${body}`);

    // Copy images
    const srcImgDir = path.join(imagesDir, postSlug);
    if (fs.existsSync(srcImgDir)) {
      const destImgDir = path.join(destPostDir, 'images');
      fs.mkdirSync(destImgDir, { recursive: true });
      for (const img of fs.readdirSync(srcImgDir)) {
        fs.copyFileSync(path.join(srcImgDir, img), path.join(destImgDir, img));
      }
    }

    console.log(`  ✓ ${trip.slug}/${postSlug}`);
    imported++;
  }
}

console.log(`\nDone: ${imported} posts imported, ${errors} errors.`);

if (missingImages.length > 0) {
  console.log(`\n⚠️  ${missingImages.length} images had no local file and were dropped:`);
  for (const m of missingImages) {
    console.log(`  ${m.post}: ${m.url}`);
  }
}
