// Copyright 2023 SIL International
// Types and utilities for to generate HTML file of verses in tables
import * as books from './books.js';
import * as draft from './draft.js';
import * as fs from 'fs';

export class Html {
  private bookInfo: books.bookType;
  private chapterRange: number[];
  private verses: string;

  // Document title
  private title: string;

  // CSS styling to apply to the tables
  private STYLE = "<style>table.tb {font-size: 14pt; font-family:Sarabun;} .tb td.c1 {width:19%} .c2 {padding: 5px;}</style>";

  // Document filename
  private fileName: string;

  // HTML string that will be written to file
  private str: string;

  constructor(bookInfo: books.bookType, chapterRange: number[], verses: string) {
    this.bookInfo = bookInfo;
    this.chapterRange = chapterRange;
    this.verses = verses;

    this.title = this.setDocumentTitle();
    this.fileName = this.getFileName();

    // Header which includes title and table styling
    this.str = "<html><head>" +
               "<title>" + this.title + "</title>" +
               this.STYLE +
               "</head>";
    this.str += "<h1>" + this.title + "</h1>";
  }

  /**
   * Get the document title
   * @returns Get
   */
  public getDocumentTitle(): string {
    return this.title;
  }

  /**
  * Adds HTML text for caption and table of the versions for a single verse
  * @param {number} currentChapter - Current chapter number
  * @param {number} currentVerse - Current verse number
  * @param {draftObjType} obj  = Drafting object
  */
  public addTable(currentChapter: number, currentVerse: number, obj: draft.draftObjType) {
    // Title for the table
    let title;
    if (this.bookInfo.thName) {
      title = this.bookInfo.thName + ' - ';
    }
    title += this.bookInfo.name + ' ' + currentChapter + ':' + currentVerse;

    let str = `<h2>${title}</h2>`;
    str += "<table class='tb'>"

    //
    // Optional table headers
    //str += "<tr><th>Version</th>";
    //str += "<th>Verse</th></tr>";

    Object.entries(draft.VERSION_TYPE).forEach(([key, value]) => {
      str += `<tr><td class='c1'>${value.name}</td><td class='c2'>${obj[key]}</td></tr>`;
    });

    const NAMES = ["Tawan", "Jum", "La", "Team"];
    NAMES.forEach(n => {
      str += `<tr><td class='c1'>${n}</td><td></td></tr>`;
    });

    str += "</table>";
    // Horizontal divider gets imported to Google Docs as page break
    str += "<hr class='pb'>";

    this.str += str;
  }

  /**
   * Add closing HTML tag
   */
  public closeFile() {
    this.str += '</HTML>';
  }

  /**
   * Write the HTML string to file
   */
  public writeFile() {
    fs.writeFileSync('./' + this.fileName, this.str);
  }

  private setDocumentTitle() : string {
    let title = (this.bookInfo.thName) ? this.bookInfo.thName + ' - ' + this.bookInfo.name :
      this.bookInfo.name;

    title += ' Ch ' + this.chapterRange[0];
    if (this.chapterRange[0] == this.chapterRange[1]) {
      // Single chapter with verse(s)
      if (this.verses) {
        title += ':' + this.verses;
      } else {
        // Determine the verse ranges
        title += ':1-' + this.bookInfo.versesInChapter[this.chapterRange[0]];
      }
    } else {
      // Multiple chapters (no verse range)
      title += '-' + this.chapterRange[1];
    }

    return title;
  }

  private getFileName(): string{
    const bookName = this.bookInfo.name;
    const chapters = (this.chapterRange[0] == this.chapterRange[1]) ?
      this.chapterRange[0] :
      `${this.chapterRange[0]}-${this.chapterRange[1]}`;
    let fileName = this.bookInfo.thName ? `${this.bookInfo.thName} - ` : "";
    fileName += this.verses ?
      `${bookName}Ch${chapters}-${this.verses}.html` :
      `${bookName}Ch${chapters}.html`
    return fileName;
  }
}

