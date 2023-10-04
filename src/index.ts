#!/usr/bin/env node
// Copyright 2023 SIL International
import { program } from 'commander';
import * as fs from 'fs';
import * as books from './books';
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
  .option("-p, --projectName <name>", "name of the project")
  .parse(process.argv);

// Debugging parameters
const options = program.opts();
const debugMode = true;
if (debugMode) {
  console.log('Parameters:');
  if (options.back) {
    console.log(`Back Translation text file path: "${options.back}"`);
  }
  if (options.text) {
    console.log(`Toolbox text file path: "${options.text}"`);
  }
  if (options.backDirectory) {
    console.log(`RTF files path: "${options.backDirectory}"`);
  }
  if (options.directory) {
    console.log(`Toolbox files path: "${options.directory}"`);
  }
  if (options.json) {
    console.log(`JSON file: "${options.json}"`);
  }
  if (options.projectName) {
    console.log(`Project Name: "${options.projectName}`);
  }
  if (options.backSuperDirectory){
    console.log(`Back Translation super directory: "${options.backSuperDirectory}`);
  }
  if (options.superDirectory){
    console.log(`Project Directory: "${options.superDirectory}`);
  }
  console.log('\n');
}

// Map of translation IDs
const ID = {
  THSV11 : 174,
  TNCV : 179,
  THAERV : 203,
  NTV : 2744,
  ESV : 59,

  SBLG : 156,

  CCB : 36
};


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

let obj = await getVerses("James", "1", "1");
console.log(obj);
//getVerses();
writeHTML("James", "1", "1", obj);

////////////////////////////////////////////////////////////////////
// End of processor functions
//////////(//////////////////////////////////////////////////////////

// Get verses

function writeHTML(book, chapter, verses, obj) {
  const title = book + " " + chapter + ":" + verses;

  let str = "<html><head><title>" + title + "</title></head>";

  str += "<h1>" + title + "</h1>";

  str += writeTable(obj);

  str += "</p>";
  str += "</html>";

  fs.writeFileSync('./' + book + chapter + '-' + verses + '.html', str);
}

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
/**
 * Write JSON file (for testing purposes).
 * Filename will be [##][XYZ][Project name].json
 * ## - 2-digit book number
 * XYZ - 3 character book code
 * Project name - Paratext project name
 * @param {books.bookType} bookObj - the book object to write to file
 */
function writeJSON(bookObj: books.objType) {
  if (debugMode) {
    // Add leading 0 if book number < 10
    const padZero = bookObj.header.bookInfo.num < 10 ? '0' : '';
    const filename = padZero + bookObj.header.bookInfo.num +
      bookObj.header.bookInfo.code + bookObj.header.projectName + '.json';
    fs.writeFileSync('./' + filename, JSON.stringify(bookObj, null, 2));
    console.info(`Writing out "${filename}"`);
  }
}
