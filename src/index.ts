#!/usr/bin/env node
// Copyright 2023 SIL International
import { program } from 'commander';
import * as fs from 'fs';
import * as books from './books.js';
import * as yv from '@glowstudent/youversion';
//const { fetchReferenceContent } = require('youversion-suggest');
//import { fetchReferenceContent, getLanguages, getBibleData } from 'youversion-suggest';

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
  .option("-b, --book <book name>", "name of book to retrieve")
  .option("-c, --chapter <chapter number>", "Chapter number as a string")
  .option("-v, --verses <verse>", "Verse numbers as a string (split by hyphen)")
  .parse(process.argv);

// Debugging parameters
const options = program.opts();
const debugMode = true;
if (debugMode) {
  console.log('Parameters:');
  if (options.book) {
    console.log(`Book name: "${options.book}"`);
  }
  if (options.chapter) {
    console.log(`Chapter: "${options.chapter}"`);
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
if (!options.chapter) {
  console.error("Chapter required");
  process.exit(1);
}


// Map of translation IDs. Replaces node_modules/@glowstudent/youversion/dist/package.json
const ID = {
  "AMP": 1588,
  "ICL00D": 1196,
  "KJV": 1,
  "NIV": 111,
  "NLT": 116,
  "NR06": 122,
  "SCH2000": 157,
  "VULG": 823,

  "THSV11" : 174,
  "TNCV" : 179,
  "THAERV" : 203,

  "NODTHNT": 1907,

  "NTV" : 2744,

  "ESV" : 59,

  "SBLG" : 156,

  "CCB" : 36
}


async function getVerses(book: string, chapter: string, verses: string) {
  let obj : draftObjType = DEFAULT_DRAFT_OBJ;

  let ref : any = {};
  ref = await yv.getVerse(book, chapter, verses, "THSV11");
  //console.log(ref.passage);
  obj.THSV11 = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "TNCV");
  //console.log(ref.passage);
  obj.TNCV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "THAERV");
  //console.log(ref.passage);
  obj.THAERV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "NODTHNT");
  //console.log(ref.passage);
  obj.NODTHNT = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "NTV");
  //console.log(ref.passage);
  obj.NTV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "ESV");
  //console.log(ref.passage);
  obj.ESV = ref.passage;

  ref = await yv.getVerse(book, chapter, verses, "SBLG");
  //console.log(ref.passage);
  obj.SBLG = ref.passage;

  return obj
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
  verseRange[1] = books.getBookByName(options.book).versesInChapter[options.chapter];
}

for (let currentVerse=verseRange[0]; currentVerse<=verseRange[1]; currentVerse++) {
  // Get verses
  let obj = await getVerses(options.book, options.chapter, currentVerse.toString());
  console.log(obj);

  writeHTML(options.book, options.chapter, currentVerse.toString(), obj);
}

if (verseRange[0] == verseRange[1]) {
  console.log('Done processing ' + options.book + ' ' + options.chapter + ':' + verseRange[0]);
} else {
  console.log('Done processing ' + options.book + ' ' + options.chapter + ':' + verseRange[0] + '-' + verseRange[1]);
}

////////////////////////////////////////////////////////////////////
// End of processor functions
//////////(//////////////////////////////////////////////////////////


function writeHTML(book, chapter, verses, obj) {
  const title = book + " " + chapter + ":" + verses;

  let str = "<html><head><title>" + title + "</title></head>";

  str += "<h1>" + title + "</h1>";

  str += writeTable(obj);

  str += "</p>";
  str += "</html>";

  fs.writeFileSync('./' + book + chapter + '-' + verses + '.html', str);
}

/**
 * Return HTML text for table
 * @param obj = Drafting object
 * @returns {string}
 */
function writeTable(obj) : string {
  let str = "";

  str += "<table>"
  str += "<tbody style='font-size: 28px'>";
  str += "<tr><th>Version</th><th>Verse</th></tr>";

  str += "<tr><td>THSV11</td><td>" + obj.THSV11 + "</td></tr>";
  str += "<tr><td>TNCV</td><td>" + obj.TNCV + "</td></tr>";
  str += "<tr><td>THA-ERV</td><td>" + obj.THAERV + "</td></tr>";
  str += "<tr><td>NODTHNT</td><td>" + obj.NODTHNT + "</td></tr>";
  str += "<tr><td>NTV</td><td>" + obj.NTV + "</td></tr>";
  str += "<tr><td>ESV</td><td>" + obj.ESV + "</td></tr>";
  str += "<tr><td>Greek</td><td>" + obj.SBLG + "</td></tr>";

  str += "<tr><td>Tawan</td></tr>";
  str += "<tr><td>Jum</td></tr>";
  str += "<tr><td>La</td></tr>";
  str += "<tr><td>Taam</td></tr>";

  str += "</table>";

  return str;
}
