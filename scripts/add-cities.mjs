#!/usr/bin/env node
/**
 * One-off migration: adds `city:` to each post's frontmatter by matching
 * the post's date and country against the itinerary stops.
 *
 * Matching rule: find stops where date_start <= postDate <= date_end AND
 * country === postCountry. When multiple stops match the same date (e.g.
 * departure days), the last matching stop wins — that's where they ended up.
 *
 * Run from the project root: node scripts/add-cities.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const { trips } = JSON.parse(
  readFileSync(join(projectRoot, 'src/data/itineraries.json'), 'utf8')
);

// Index stops by trip_id for fast lookup
const stopsByTrip = {};
for (const trip of trips) {
  stopsByTrip[trip.trip_id] = trip.stops;
}

function findPosts(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findPosts(full));
    } else if (entry === 'index.md') {
      results.push(full);
    }
  }
  return results;
}

const postFiles = findPosts(join(projectRoot, 'src/content/posts'));

let updated = 0;
let skipped = 0;
let noMatch = 0;

for (const filePath of postFiles) {
  const raw = readFileSync(filePath, 'utf8');

  // Locate frontmatter block
  if (!raw.startsWith('---')) continue;
  const fmEnd = raw.indexOf('\n---', 3);
  if (fmEnd === -1) continue;
  const fm = raw.slice(4, fmEnd); // content between the two ---

  // Skip posts that already have a city
  if (/^city:/m.test(fm)) {
    skipped++;
    continue;
  }

  // Parse needed fields (handles quoted or unquoted values)
  const dateMatch   = fm.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  const countryMatch = fm.match(/^country:\s*"?([^"\n]+?)"?\s*$/m);
  const tripMatch    = fm.match(/^trip:\s*"?([^"\n]+?)"?\s*$/m);

  if (!dateMatch || !countryMatch || !tripMatch) continue;

  const postDate    = dateMatch[1];
  const postCountry = countryMatch[1].trim();
  const tripId      = tripMatch[1].trim();

  const stops = stopsByTrip[tripId];
  if (!stops) {
    console.warn(`  ⚠ No itinerary for trip "${tripId}": ${filePath}`);
    noMatch++;
    continue;
  }

  // Find all stops where date is in range and country matches
  const matching = stops.filter(s =>
    s.date_start <= postDate &&
    postDate <= s.date_end &&
    s.country === postCountry
  );

  if (matching.length === 0) {
    const rel = filePath.split('/posts/')[1];
    console.log(`  – No match: ${rel} (${postDate}, ${postCountry})`);
    noMatch++;
    continue;
  }

  // Last matching stop wins (handles same-day multi-stop departure days)
  const city = matching[matching.length - 1].city;

  // Insert `city:` on the line immediately after `country:`
  const countryLineMatch = fm.match(/^country:.+$/m);
  if (!countryLineMatch) continue;
  const countryLine = countryLineMatch[0];
  const countryIdx  = fm.indexOf(countryLine);
  const newFm =
    fm.slice(0, countryIdx + countryLine.length) +
    `\ncity: "${city}"` +
    fm.slice(countryIdx + countryLine.length);

  const newRaw = '---' + raw.slice(3, 4) + newFm + raw.slice(fmEnd);
  writeFileSync(filePath, newRaw, 'utf8');

  const rel = filePath.split('/posts/')[1];
  console.log(`  ✓ ${rel} → ${city}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${skipped} already had city, ${noMatch} no match`);
