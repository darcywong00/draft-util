#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright 2023 SIL International
import { CommanderError, program } from 'commander';
import * as fs from 'fs';
import * as books from './books.js';
import * as draft from './draft.js';
import * as html from './html.js';
import * as yv from '@glowstudent/youversion';

////////////////////////////////////////////////////////////////////
// Get parameters
////////////////////////////////////////////////////////////////////
program
  .description("Drafting utilities to pull multiple Bible translations")
  .requiredOption("-b, --book <book name>", "name of book to retrieve. " +
      "Could be 3-character alias: https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases\n" +
      "If book is the only parameter, the entire book will be processed (divided into 5-chapter files as necessary")
  .option("-c, --chapters <chapter number>", "Chapter number as a string (chapters split by hyphen")
  .option("-v, --verses <verse>", "Verse number as a string (verses split by hyphen)")
  .exitOverride();
try {
  program.parse();
} catch(error: unknown) {
  if (error instanceof CommanderError) {
    console.error(error.message);
  }
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

// Determine the chapter ranges
let chapterRange: number[] = [];
if (options.chapters) {
  chapterRange = options.chapters.split('-').map(Number);
  if (chapterRange.length == 1) {
    chapterRange[1] = chapterRange[0];
  }

  await processChapterRange();
} else {
  // Process the entire book, a chunk number of chapters at a time
  const CHAPTER_CHUNKS_PER_BOOK = 5;
  chapterRange[0] = 1;
  chapterRange[1] = Math.min(CHAPTER_CHUNKS_PER_BOOK, bookInfo.chapters);
  while(chapterRange[0] <= chapterRange[1] && chapterRange[1] <= bookInfo.chapters) {
    await processChapterRange();

    // Update chapter range
    chapterRange[0] = chapterRange[1] + 1;
    chapterRange[1] = Math.min(chapterRange[1] + CHAPTER_CHUNKS_PER_BOOK, bookInfo.chapters);
  }
}



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
  } else if (!options.chapters && options.verses) {
    console.error("Cannot get verses " + options.verses + " without a chapter parameter");
    process.exit(1);
  }
}

async function processChapterRange() {
  // Start new document
  const Html = new html.Html(bookInfo, chapterRange, options.verses);

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
        console.error(`Unable to determine verses for ${bookInfo.name} chapter ${currentChapter}. Exiting`);
        process.exit(1);
      }
    }

    for (let currentVerse=verseRange[0]; currentVerse<=verseRange[1]; currentVerse++) {
      // Get verses
      const obj : draft.draftObjType = draft.DEFAULT_DRAFT_OBJ;

      const chapter = currentChapter.toString();
      const verses = currentVerse.toString();

      // Timing: const startTime = Date.now();
      const ref = await Promise.all(getVerses(bookInfo, chapter, verses));

      checkError(loggingObj, ref, bookInfo.name, chapter, verses);
      Object.keys(draft.VERSION_TYPE).forEach((version, index) => {
        // Assign the passage for each version
        obj[version] = ref[index].passage;
      });

      // Timing: (old way took ~0.6s up to 3 or 4 seconds for a single verse)
      //const elapsedTime = (Date.now() - startTime)/1000;
      //console.log(`Verses took ${elapsedTime} seconds`);
      console.log(obj);

      Html.addTable(currentChapter, currentVerse, obj);
    }
  }

  Html.closeFile();
  Html.writeFile();

  fs.writeFileSync('./errors.json', JSON.stringify(loggingObj, null, 2));

  console.log('Done processing ' + Html.getDocumentTitle());
}

function getVerses(bookInfo: books.bookType, chapter: string, verses: string) :
    Array<Promise<any>> {

  const promises : Array<Promise<any>> = [];
  Object.keys(draft.VERSION_TYPE).forEach((version) => {
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
  Object.keys(draft.VERSION_TYPE).forEach((version, index) => {
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
