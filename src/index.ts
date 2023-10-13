#!/usr/bin/env node
// Copyright 2023 SIL International
import { program } from 'commander';
import * as fs from 'fs';
import * as books from './books.js';
import * as yv from '@glowstudent/youversion';

// Translation IDs and names to use in tables
// IDs need to match node_models/@glowstudent/youversion/dist/versions.json
// Only include versions that will be queried
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
};

const DEFAULT_DRAFT_OBJ : draftObjType = {
  THSV11 : "",
  TNCV : "",
  THAERV : "",
  NTV : "",
  ESV : "",
  NODTHNT: "",

  SBLG : "",
}

////////////////////////////////////////////////////////////////////
// Get parameters
////////////////////////////////////////////////////////////////////
program
  .description("Drafting utilities to pull multiple Bible translations")
  .requiredOption("-b, --book <book name>", "name of book to retrieve. " +
      "Could be 3-character alias: https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases")
  .requiredOption("-c, --chapters <chapter number>", "Chapter number as a string (chapters split by hyphen")
  .option("-v, --verses <verse>", "Verse number as a string (verses split by hyphen)")
  .exitOverride();
try {
  program.parse();
} catch(error: any) {
  console.error(error.message);
  process.exit(1);
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
    const obj : draftObjType = DEFAULT_DRAFT_OBJ;

    const chapter = currentChapter.toString();
    const verses = currentVerse.toString();

    // Timing: const startTime = Date.now();
    const ref = await Promise.all(getVerses(bookInfo, chapter, verses));

    checkError(loggingObj, ref, bookInfo.name, chapter, verses);
    Object.keys(versionType).forEach((version, index) => {
      // Assign the passage for each version
      obj[version] = ref[index].passage;
    });

    // Timing: (old way took ~0.6s up to 3 or 4 seconds for a single verse)
    //const elapsedTime = (Date.now() - startTime)/1000;
    //console.log(`Verses took ${elapsedTime} seconds`);
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

  // Commander already checked required parameters
  // Having both chapter range and verse range is invalid
  if (options.chapters?.includes('-') && options?.verses?.includes('-')) {
    console.error("Cannot have chapter: " + options.chapters + " and verses: " +
      options.verses + " at the same time");
    process.exit(1);
  }
}

function getVerses(bookInfo: books.bookType, chapter: string, verses: string) :
    Array<Promise<any>> {

  const promises : Array<Promise<any>> = [];
  Object.keys(versionType).forEach((version) => {
    promises.push(yv.getVerse(bookInfo.code, chapter, verses, version));
  });
  return promises;
}

/**
 * Quick sanity check that queried verse is valid.
 * TODO: some verses are undefined if it shows in a footnote (issue #3)
 * @param {string[]} loggingObj - Any errors in getting a verse are added to this log
 * @param {any[]} ref - array of 1 verse (multiple versions) returned from YouVersion query
 * @param {string} book - book name
 * @param {string} chapter - chapter number as string
 * @param {string} currentVerse - verse number as string
 */
function checkError(loggingObj: string[], ref: any[], book: string, chapter: string, currentVerse: string) {
  Object.keys(versionType).forEach((version, index) => {
    const reference = `${book} Ch ${chapter}:${currentVerse} (${version})`;
    try {
      if (ref[index].code == 400) {
        const msg = `ERROR: ${ref[index].message} for ${reference}`;
        console.error(msg);
        loggingObj.push(msg);
        // Exit?
        // process.exit(1);
      } else if (!ref[index].passage) {
        const msg = `WARN: Verse undefined for ${reference}`;
        //console.warn(msg);
        loggingObj.push(msg);
      }
    } catch (e: any) {
      console.error(e.message);
      loggingObj.push(e.message);
    }
  });
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
 * @param {books.bookType} bookInfo - Info on current book
 * @param {number} currentChapter - Current chapter number
 * @param {number} currentVerse - Current verse number
 * @param {draftObjType} obj  = Drafting object
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

  Object.entries(versionType).forEach(([key, value]) => {
    str += `<tr><td>${value.name}</td><td>${obj[key]}</td></tr>`;
  });

  const names = ["Tawan", "Jum", "La", "Taam"];
  names.forEach(n => {
    str += `<tr><td>${n}</td><td></td></tr>`;
  });

  str += "</table>";

  // Horizontal divider gets imported to Google Docs as page break
  str += "<hr class='pb'>";

  return str;
}
