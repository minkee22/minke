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
    if (['.git', 'node_modules', 'archive', 'fonts', '_retired'].includes(entry.name)) continue;
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
    if (isLocal(value) && !exists(path.join(path.dirname(file), clean(value)))) report(file, `missing file ${value}`);
  }
}

// Every slide exists in both languages and both sizes.
for (let number = 1; number <= 7; number += 1) {
  for (const name of ['page', 'page-1200', 'page-en', 'page-1200-en']) {
    const file = `assets/slides/folio-0${number}-${name}.webp`;
    if (!exists(file)) report('assets/slides', `missing ${file}`);
  }
}

// ARTWORK and COLLECTIONS image lists.
const ARCHIVE = new Function(`${read('assets/data/archive-data.js')}; return ARCHIVE;`)();
const sections = [...ARCHIVE.collections, ...ARCHIVE.artwork];
let imageTotal = 0;
for (const section of sections) {
  const images = section.sheets.flat();
  imageTotal += images.length;
  if (images.length !== section.count) report('assets/data/archive-data.js', `${section.id} count is ${section.count}, list has ${images.length}`);
  if (!exists(`assets/archive/covers/${section.id}.webp`)) report('assets/data/archive-data.js', `${section.id} has no cover`);
  const listed = new Set(images.map(([file]) => file));
  for (const file of listed) {
    if (!exists(`assets/archive/${section.id}/${file}.webp`)) report('assets/data/archive-data.js', `missing assets/archive/${section.id}/${file}.webp`);
    if (!exists(`assets/archive/${section.id}/t/${file}.webp`)) report('assets/data/archive-data.js', `missing assets/archive/${section.id}/t/${file}.webp`);
  }
  for (const entry of fs.readdirSync(path.join(root, 'assets/archive', section.id))) {
    if (entry.endsWith('.webp') && !listed.has(entry.replace('.webp', ''))) report('assets/data/archive-data.js', `assets/archive/${section.id}/${entry} is not listed`);
  }
}

// Homepage prints: real files, with no repeats.
const {HERO_POOL, HERO_BEAR} = new Function(`${read('assets/data/hero-data.js')}; return {HERO_POOL, HERO_BEAR};`)();
if (HERO_POOL.length < 10) report('assets/data/hero-data.js', 'the pool needs at least 10 prints');
if (new Set(HERO_POOL.map(print => print[1])).size < 5) report('assets/data/hero-data.js', 'the pool needs at least 5 sections');
if (!exists(`assets/archive/covers/${HERO_BEAR[1]}.webp`)) report('assets/data/hero-data.js', 'missing the bear cover');
for (const [, section, file] of HERO_POOL) {
  if (section === 'sketch') report('assets/data/hero-data.js', `${file} is a sketch`);
  if (!exists(`assets/archive/${section}/t/${file}.webp`)) report('assets/data/hero-data.js', `missing ${section}/${file}`);
}

// The homepage repeats each section count.
const homeCounts = [...read('index.html').matchAll(/data-i18n-count="(\d+)"/g)].map(match => Number(match[1]));
const expected = sections.map(section => section.count);
if (homeCounts.join() !== expected.join()) report('index.html', `image counts ${homeCounts} should be ${expected}`);

// Both languages must exist for every key a page or script asks for.
const strings = new Function(`${read('assets/data/i18n-data.js')}; return I18N_STRINGS;`)();
for (const [key, pair] of Object.entries(strings)) {
  if (pair.length !== 2 || pair.some(value => !value || !value.length)) report('assets/data/i18n-data.js', `${key} needs Korean and English`);
  if (/[\uac00-\ud7a3]/.test(JSON.stringify(pair[1]))) report('assets/data/i18n-data.js', `${key} has Korean in the English text`);
}
const pages = textFiles.filter(name => name.endsWith('.html'));
for (const file of [...pages, 'assets/js/viewer.js']) {
  const source = read(file);
  const keys = [...source.matchAll(/data-i18n="([^"]+)"/g)].map(match => match[1]);
  for (const [, list] of source.matchAll(/data-i18n-attr="([^"]+)"/g)) keys.push(...list.split(';').map(pair => pair.split(':')[1]));
  for (const key of keys) {
    if (!strings[key]) report(file, `unknown text key ${key}`);
  }
}
for (const section of sections) {
  for (const field of ['label', 'title', 'note']) {
    if (!strings[`section.${section.id}.${field}`]) report('assets/data/i18n-data.js', `missing section.${section.id}.${field}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s) found:`);
  problems.forEach(problem => console.error(`  ${problem}`));
  process.exit(1);
}
console.log(`OK: ${textFiles.length} text files, ${sections.length} sections, ${imageTotal} images.`);
