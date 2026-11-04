#!/usr/bin/env node
// Checks the site before a pull request: local links, image lists and banned punctuation.
// Needs only Node. Run from anywhere: node tools/check-site.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const problems = [];
const report = (file, message) => problems.push(`${file}: ${message}`);
const exists = relative => fs.existsSync(path.join(root, relative));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

function walk(folder, found = []) {
  for (const entry of fs.readdirSync(path.join(root, folder), {withFileTypes: true})) {
    if (['.git', 'node_modules', 'archive', 'fonts'].includes(entry.name)) continue;
    const relative = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(relative, found);
    else found.push(relative);
  }
  return found;
}

const textFiles = walk('.').filter(file => /\.(html|js|css|md|yml)$/.test(file));

// Em dash, en dash, middle dot and a free standing double hyphen.
const marks = String.fromCharCode(0x2014, 0x2013, 0xb7);
const banned = new RegExp(`[${marks}]|(^|\\s)--(\\s|$)`);
for (const file of textFiles) {
  read(file).split('\n').forEach((line, index) => {
    if (banned.test(line)) report(file, `line ${index + 1} has banned punctuation: ${line.trim().slice(0, 60)}`);
  });
}

// Local files named by pages and stylesheets.
const isLocal = value => value && !/^(https?:|mailto:|data:|#)/.test(value);
const clean = value => decodeURI(value.split(/[?#]/)[0]);
for (const file of textFiles.filter(name => name.endsWith('.html'))) {
  const html = read(file);
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (isLocal(value) && clean(value) && !exists(clean(value))) report(file, `missing file ${value}`);
  }
  for (const [, list] of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of list.split(',')) {
      const value = part.trim().split(/\s+/)[0];
      if (isLocal(value) && !exists(clean(value))) report(file, `missing file ${value}`);
    }
  }
}
for (const file of textFiles.filter(name => name.endsWith('.css'))) {
  for (const [, value] of read(file).matchAll(/url\("?([^")]+)"?\)/g)) {
    if (isLocal(value) && !exists(clean(value))) report(file, `missing file ${value}`);
  }
}

// ARTWORK and COLLECTIONS image lists.
const ARCHIVE = new Function(`${read('archive-data.js')}; return ARCHIVE;`)();
const sections = [...ARCHIVE.collections, ...ARCHIVE.artwork];
let imageTotal = 0;
for (const section of sections) {
  const images = section.sheets.flat();
  imageTotal += images.length;
  if (images.length !== section.count) report('archive-data.js', `${section.id} count is ${section.count}, list has ${images.length}`);
  if (!exists(`archive/covers/${section.id}.webp`)) report('archive-data.js', `${section.id} has no cover`);
  const listed = new Set(images.map(([file]) => file));
  for (const file of listed) {
    if (!exists(`archive/${section.id}/${file}.webp`)) report('archive-data.js', `missing archive/${section.id}/${file}.webp`);
    if (!exists(`archive/${section.id}/t/${file}.webp`)) report('archive-data.js', `missing archive/${section.id}/t/${file}.webp`);
  }
  for (const entry of fs.readdirSync(path.join(root, 'archive', section.id))) {
    if (entry.endsWith('.webp') && !listed.has(entry.replace('.webp', ''))) report('archive-data.js', `archive/${section.id}/${entry} is not listed`);
  }
}

// The homepage repeats each section count.
const homeCounts = [...read('index.html').matchAll(/<small>(\d+) IMAGES<\/small>/g)].map(match => Number(match[1]));
const expected = sections.map(section => section.count);
if (homeCounts.join() !== expected.join()) report('index.html', `image counts ${homeCounts} should be ${expected}`);

if (problems.length) {
  console.error(`${problems.length} problem(s) found:`);
  problems.forEach(problem => console.error(`  ${problem}`));
  process.exit(1);
}
console.log(`OK: ${textFiles.length} text files, ${sections.length} sections, ${imageTotal} images.`);
