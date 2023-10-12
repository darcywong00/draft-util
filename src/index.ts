#!/usr/bin/env node
// Copyright 2023 SIL International
import { program } from 'commander';
import * as fs from 'fs';
import * as books from './books.js';
import * as yv from '@glowstudent/youversion';

// Translation IDs and names to use in tables
// IDs need to match node_models/@glowstudent/youversion/dist/versions.json
const versionType = {
  // Thai versions
  THSV11: {
    id: 174,
    name: "มาตรฐาน<br>THSV 2011"},
  TNCV: {
    id: 179,
    name: "อมตธรรมร่วมสมัย<br>TNCV"},
  THAERV: {
    id: 203,
    name: "อ่านเข้าใจง่าย<br>Easy to read"},

  // Lanna
  NODTHNT: {
    id: 1907,
    name: "คำเมือง<br>(Lanna)"},

  // Thai
  NTV: {
    id: 2744,
    name: "แปลใหม่<br>(NTV)"},

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
  .requiredOption("-b, --book <book name>", "name of book to retrieve. " +
      "Could be 3-character alias: https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases")
  .option("-c, --chapters <chapter number>", "Chapter number as a string (chapters split by hyphen")
  .option("-v, --verses <verse>", "Verse number as a string (verses split by hyphen)")
  .exitOverride();
try {
  program.parse();
} catch(error: any) {
  console.error(error.message);
}

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

// Document title
const title = getDocumentTitle(bookInfo, chapterRange, options.verses);
let str = "<html><head><title>" + title + "</title></head>";
str += "<h1>" + title + "</h1>";

const loggingObj: string[] = [];
for (let currentChapter=chapterRange[0]; currentChapter<=chapterRange[1]; currentChapter++) {
  // Process entire chapter

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
    verseRange[1] = bookInfo.versesInChapter[currentChapter];
    if (!verseRange[1]) {
      console.error(`Unable to determine verses for ${bookInfo.name} chapter ${currentChapter}`);
    }
  }

  for (let currentVerse=verseRange[0]; currentVerse<=verseRange[1]; currentVerse++) {
    // Get verses
    const obj = await getVerses(bookInfo, currentChapter, currentVerse, loggingObj);
    console.log(obj);

    str += writeTable(bookInfo, currentChapter, currentVerse, obj);
  }
}

str += "</html>";

let fileName = bookInfo.thName ? `${bookInfo.thName} - ` : "";
fileName += options.verses ?
  `${bookName}Ch${options.chapters}-${options.verses}.html` :
  `${bookName}Ch${options.chapters}.html`
fs.writeFileSync('./' + fileName, str);

fs.writeFileSync('./errors.json', JSON.stringify(loggingObj, null, 2));

console.log('Done processing ' + title);

////////////////////////////////////////////////////////////////////
// End of processor functions
////////////////////////////////////////////////////////////////////

function validateParameters(options) {
  const debugMode = true;
  if (debugMode) {
    console.log('Parameters:');
    if (options.book) {
      console.log(`Book parameter: "${options.book}"`);
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

async function getVerses(bookInfo: books.bookType, currentChapter: number, currentVerse: number, loggingObj: string[]) :
    Promise<draftObjType> {
  const obj : draftObjType = DEFAULT_DRAFT_OBJ;
  const chapter = currentChapter.toString();
  const verses = currentVerse.toString();

  let ref : any = {};
  ref = await yv.getVerse(bookInfo.code, chapter, verses, "THSV11");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'THSV11');
  //console.log(ref.passage);
  obj.THSV11 = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "TNCV");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'TNCV');
  //console.log(ref.passage);
  obj.TNCV = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "THAERV");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'THAERV');
  //console.log(ref.passage);
  obj.THAERV = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "NODTHNT");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'NODTHNT');
  //console.log(ref.passage);
  obj.NODTHNT = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "NTV");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'NTV');
  //console.log(ref.passage);
  obj.NTV = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "ESV");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'ESV');
  //console.log(ref.passage);
  obj.ESV = ref.passage;

  ref = await yv.getVerse(bookInfo.code, chapter, verses, "SBLG");
  checkError(loggingObj, ref, bookInfo.name, chapter, verses,  'SBLG');
  //console.log(ref.passage);
  obj.SBLG = ref.passage;

  return obj
}

/**
 * Quick sanity check that query for a verse is valid.
 * TODO: some verses are undefined if it shows in a footnote (issue #3)
 * @param loggingObj {string[]} - Any errors in getting a verse are added to this log
 * @param ref - verse returned from YouVersion query
 * @param book {string} - book name
 * @param chapter {string} - chapter number as string
 * @param currentVerse  {string} - verse number as string
 * @param version {string} - version of a verse
 */
function checkError(loggingObj: string[], ref, book: string, chapter: string, currentVerse: string, version: string) {
  const reference = `${book} Ch ${chapter}:${currentVerse} (${version})`;
  if (ref.code == 400) {
    const msg = `ERROR: ${ref.message} for ${reference}`;
    console.error(msg);
    loggingObj.push(msg);
    // Exit?
    // process.exit(1);
  } else if (!ref.passage) {
    const msg = `WARN: Verse undefined for ${reference}`;
    //console.warn(msg);
    loggingObj.push(msg);
  }
}

function getDocumentTitle(bookInfo: books.bookType, chapterRange: number[], verses: string) : string {
  let title = (bookInfo.thName) ? bookInfo.thName + ' - ' + bookInfo.name :
    bookInfo.name;

  title += ' Ch ' + chapterRange[0];
  if (chapterRange[0] == chapterRange[1]) {
    // Single chapter with verse(s)
    if (verses) {
      title += ':' + verses;
    } else {
      // Determine the verse ranges
      title += ':1-' + bookInfo.versesInChapter[options.chapters];
    }
  } else {
    // Multiple chapters (no verse range)
    title += '-' + chapterRange[1];
  }

  return title;
}

/**
 * Return HTML text for caption and table of the versions for a single verse
 * @param bookInfo {books.bookType} - Info on current book
 * @param currentChapter {number} - Current chapter number
 * @param currentVerse {number} - Current verse number
 * @param obj = Drafting object
 * @returns {string} - HTML text for table
 */
function writeTable(bookInfo: books.bookType, currentChapter: number, currentVerse: number, obj: draftObjType) : string {
  let title;
  if (bookInfo.thName) {
    title = bookInfo.thName + ' - ';
  }
  title += bookInfo.name + ' ' + currentChapter + ':' + currentVerse;

  let str = `<h2>${title}</h2>`;
  str += "<table>"

  str += "<colgroup>";
  str += "<col span='1' style='width: 10%;'>";
  str += "<col span='1' style='width: 90%;'>";
  str += "</colgroup>";

  str += "<tbody style='font-size: 14pt; font-family:Sarabun;'>";

  // Optional table headers
  //str += "<tr><th>Version</th>";
  //str += "<th>Verse</th></tr>";

  str += "<tr><td>" + versionType.THSV11.name + "</td><td>" + obj.THSV11 + "</td></tr>";
  str += "<tr><td>" + versionType.TNCV.name + "</td><td>" + obj.TNCV + "</td></tr>";
  str += "<tr><td>" + versionType.THAERV.name + "</td><td>" + obj.THAERV + "</td></tr>";
  str += "<tr><td>" + versionType.NODTHNT.name + "</td><td>" + obj.NODTHNT + "</td></tr>";
  str += "<tr><td>" + versionType.NTV.name + "</td><td>" + obj.NTV + "</td></tr>";
  str += "<tr><td>" + versionType.ESV.name + "</td><td>" + obj.ESV + "</td></tr>";
  str += "<tr><td>" + versionType.SBLG.name + "</td><td>" + obj.SBLG + "</td></tr>";

  str += "<tr><td>Tawan</td><td></td></tr>";
  str += "<tr><td>Jum</td><td></td></tr>";
  str += "<tr><td>La</td><td></td></tr>";
  str += "<tr><td>Taam</td><td></td></tr>";

  str += "</table>";

  // Horizontal divider gets imported to Google Docs as page break
  str += "<hr class='pb'>";

  return str;
}
