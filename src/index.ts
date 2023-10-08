#!/usr/bin/env node
// Copyright 2023 SIL International
import { program } from 'commander';
import * as fs from 'fs';
import * as books from './books.js';
import * as yv from '@glowstudent/youversion';
//const { fetchReferenceContent } = require('youversion-suggest');
//import { fetchReferenceContent, getLanguages, getBibleData } from 'youversion-suggest';

// Translation IDs and names to use in tables
// IDs need to match node_models/@glowstudent/youversion/dist/versions.json
const versionType = {
  // Thai versions
  THSV11: {
    id: 174,
    name: "มาตรฐาน\nTHSV 2011"},
  TNCV: {
    id: 179,
    name: "อมตธรรมร่วมสมัย\nTNCV"},
  THAERV: {
    id: 203,
    name: "อ่านเข้าใจง่าย\nEasy to read"},

  // Lanna
  NODTHNT: {
    id: 1907,
    name: "คำเมือง\n(Lanna)"},

  // Thai
  NTV: {
    id: 2744,
    name: "แปลใหม่\n(NTV)"},

  // English
  ESV: {
    id: 59,
    name: "ESV"},

  // Greek
  SBLG: {
    id: 156,
    name: "Greek"},

  CCB: {
    id: 36,
    name: "Simplified Chinese"
  }
};

// Object to hold multiple versions for a single verse
type draftObjType = {
  // Thai versions
  THSV11 : string,
  TNCV : string,
  THAERV : string,

  // Lanna
  NODTHNT: string,

  // Thai
  NTV : string,

  // English
  ESV : string,

  // Greek
  SBLG : string,

  CCB? : string

};

const DEFAULT_DRAFT_OBJ : draftObjType = {
  THSV11 : "",
  TNCV : "",
  THAERV : "",
  NTV : "",
  ESV : "",
  NODTHNT: "",

  SBLG : "",

  CCB : ""
}

////////////////////////////////////////////////////////////////////
// Get parameters
////////////////////////////////////////////////////////////////////
program
  .description("Drafting utilities to pull multiple Bible translations")
  .option("-b, --book <book name>", "name of book to retrieve. " +
          "Could be 3-character alias: https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases")
  .option("-c, --chapters <chapter number>", "Chapter number as a string (chapters split by hyphen")
  .option("-v, --verses <verse>", "Verse number as a string (verses split by hyphen)")
  .parse(process.argv);

// Validate parameters
const options = program.opts();
validateParameters(options);

// Determine book code and book name
const bookCode = (options.book.length == 3) ?
  options.book.toUpperCase() :
  books.getBookByName(options.book).code;
const bookInfo = books.getBookByCode(bookCode);
const bookName = bookInfo.name;

// Determine the chapter ranges
let chapterRange: number[] = [];
if (options.chapters) {
  chapterRange = options.chapters.split('-');
  if (chapterRange.length == 1) {
    chapterRange[1] = chapterRange[0];
  }
}

// Determine the verse ranges
let verseRange : number[] = [];
if (options.verses) {
  verseRange = options.verses.split('-');
  if (verseRange.length == 1) {
    verseRange[1] = verseRange[0];
  }
} else {
  // Do all the verses in a chapter
  verseRange[0] = 1;
  verseRange[1] = bookInfo.versesInChapter[options.chapters];
}

// Document title
const title = getDocumentTitle(bookInfo, chapterRange, verseRange);
let str = "<html><head><title>" + title + "</title></head>";
str += "<h1>" + title + "</h1>";

for (let currentVerse=verseRange[0]; currentVerse<=verseRange[1]; currentVerse++) {
  // Get verses
  const obj = await getVerses(options.book, options.chapters, currentVerse);
  console.log(obj);

  str += writeTable(bookName, options.chapters, currentVerse, obj);
}


str += "</html>";

fs.writeFileSync('./' + bookName + 'Ch' + options.chapters + '-' + verseRange[0] + '-' + verseRange[1] + '.html', str);

console.log('Done processing ' + title);

////////////////////////////////////////////////////////////////////
// End of processor functions
////////////////////////////////////////////////////////////////////

function validateParameters(options) {
  const debugMode = true;
  if (debugMode) {
    console.log('Parameters:');
    if (options.book) {
      console.log(`Book name: "${options.book}"`);
    }
    if (options.chapters) {
      console.log(`Chapter: "${options.chapters}"`);
    }
    if (options.verses) {
      console.log(`Verses: "${options.verses}"`);
    }
    console.log('\n');
  }

  // Book and chapter required
  if (!options.book) {
    console.error("Book name required");
    process.exit(1);
  }
  if (!options.chapters) {
    console.error("Chapters required");
    process.exit(1);
  }

  // Having both chapter range and verse range is invalid
  if (options.chapters?.includes('-') && options?.verses?.includes('-')) {
    console.error("Cannot have chapter: " + options.chapters + " and verses: " +
      options.verses + " at the same time");
    process.exit(1);
  }
}

async function getVerses(book: string, chapter: string, currentVerse: number) {
  const obj : draftObjType = DEFAULT_DRAFT_OBJ;
  const verses = currentVerse.toString();

  let ref : any = {};
  ref = await yv.getVerse(book, chapter, verses, "THSV11");
  checkError(ref, book, chapter, verses,  'THSV11');
  //console.log(ref.passage);
  obj.THSV11 = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "TNCV");
  checkError(ref, book, chapter, verses,  'TNCV');
  //console.log(ref.passage);
  obj.TNCV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "THAERV");
  checkError(ref, book, chapter, verses,  'THAERV');
  //console.log(ref.passage);
  obj.THAERV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "NODTHNT");
  checkError(ref, book, chapter, verses,  'NODTHNT');
  //console.log(ref.passage);
  obj.NODTHNT = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "NTV");
  checkError(ref, book, chapter, verses,  'NTV');
  //console.log(ref.passage);
  obj.NTV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "ESV");
  checkError(ref, book, chapter, verses,  'ESV');
  //console.log(ref.passage);
  obj.ESV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "SBLG");
  checkError(ref, book, chapter, verses,  'SBLG');
  //console.log(ref.passage);
  obj.SBLG = ref.passage;

  return obj
}

/**
 * Quick sanity check that query for a verse is valid.
 * TODO: some verses are undefined if it shows in a footnote
 * @param ref - verse returned from YouVersion query
 * @param book {string} - book name
 * @param chapter {string} - chapter number as string
 * @param currentVerse  {string} - verse number as string
 * @param version {string} - version of a verse
 */
function checkError(ref, book: string, chapter: string, currentVerse: string, version: string) {
  if (ref.code == 400) {
    console.error(ref.message + ' for ' + book + ' Ch ' + chapter + ':' + currentVerse + ' (' + version + ')');
    process.exit(1);
  }
}

function getDocumentTitle(bookInfo: books.bookType, chapterRange: number[], verseRange: number[]) : string {
  let title = (bookInfo.thName) ? bookInfo.thName + ' - ' + bookInfo.name :
    bookInfo.name;

  title += ' Ch ' + chapterRange[0];
  if (chapterRange[0] == chapterRange[1]) {
    // Single chapter with verse(s)
    title += ':' + verseRange[0];

    if (verseRange[0] != verseRange[1]) {
      title += '-' + verseRange[1];
    }
  } else {
    // Multiple chapters (no verse range)
    title += '-' + chapterRange[1];
  }

  return title;
}

function writeHTML(book, chapter, verses, obj) {
  const title = book + " " + chapter + ":" + verses;

  let str = "<html><head><title>" + title + "</title></head>";

  str += "<h1>" + title + "</h1>";

  str += writeTable(book, chapter, verses[0], obj);

  str += "</p>";
  str += "</html>";

  fs.writeFileSync('./' + book + chapter + '-' + verses + '.html', str);
}

/**
 * Return HTML text for table of the versions for a single verse
 * @param book {string} - Book name for title
 * @param chapter {string} - Chapter number
 * @param currentVerse {string} - Current verse number
 * @param obj = Drafting object
 * @returns {string} - HTML text for table
 */
function writeTable(book: string, chapter: string, currentVerse: number, obj: draftObjType) : string {
  let str = "<h2>" + book + ' ' + chapter + ':' + currentVerse + "</h2>";

  str += "<table>"

  str += "<colgroup>";
  str += "<col span='1' style='width: 10%;'>";
  str += "<col span='1' style='width: 90%;'>";
  str += "</colgroup>";

  str += "<tbody style='font-size: 14pt; font-family:Sarabun;'>";
  //str += "<tr><th>Version</th>";
  //str += "<th>Verse</th></tr>";

  str += "<tr><td>THSV11</td><td>" + obj.THSV11 + "</td></tr>";
  str += "<tr><td>TNCV</td><td>" + obj.TNCV + "</td></tr>";
  str += "<tr><td>THA-ERV</td><td>" + obj.THAERV + "</td></tr>";
  str += "<tr><td>NODTHNT</td><td>" + obj.NODTHNT + "</td></tr>";
  str += "<tr><td>NTV</td><td>" + obj.NTV + "</td></tr>";
  str += "<tr><td>ESV</td><td>" + obj.ESV + "</td></tr>";
  str += "<tr><td>Greek</td><td>" + obj.SBLG + "</td></tr>";

  str += "<tr><td>Tawan</td><td></td></tr>";
  str += "<tr><td>Jum</td><td></td></tr>";
  str += "<tr><td>La</td><td></td></tr>";
  str += "<tr><td>Taam</td><td></td></tr>";

  str += "</table>";
  str += "<hr class='pb'>";

  return str;
}
