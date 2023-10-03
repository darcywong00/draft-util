// Copyright 2022 SIL International
// Types and utilities for handling Paratext book information

/**
 * 3-character book code that Paratext uses (from BookNames.xml).
 * "000" is a placeholder for book number 0 so that book number matches index.
 *       (not a valid Paratext book code)
 * "XXA" to "XXG" are extra books that can be used for SFM Console logging.
 */
export type CodeType =
  // Placeholder
  "000" |

  // OT
  "GEN" | "EXO" | "LEV" | "NUM" | "DEU" |
  "JOS" | "JDG" | "RUT" | "1SA" | "2SA" | "1KI" | "2KI" | "1CH" | "2CH" |
  "EZR" | "NEH" | "EST" |
  "JOB" | "PSA" | "PRO" | "ECC" | "SNG" |
  "ISA" | "JER" | "LAM" | "EZK" | "DAN" |
  "HOS" | "JOL" | "AMO" | "OBA" | "JON" |
  "MIC" | "NAM" | "HAB" | "ZEP" | "HAG" | "ZEC" | "MAL" |

  // NT
  "MAT" | "MRK" | "LUK" |"JHN" |
  "ACT" | "ROM" | "1CO" | "2CO" |
  "GAL" | "EPH" | "PHP" | "COL" |
  "1TH" | "2TH" | "1TI" | "2TI" |
  "TIT" | "PHM" | "HEB" | "JAS" | "1PE" | "2PE" |
  "1JN" | "2JN" | "3JN" | "JUD" | "REV" |

  // Extra books for logging
  "XXA" | "XXB" | "XXC" | "XXD" | "XXE" | "XXF" | "XXG";

export interface bookType {
  code: CodeType;   // 3-character book indentifier as defined by
                    // https://ubsicap.github.io/usfm/identification/books.html
  name: string;     // Book name
  num: number;      // Book number as defined by
                    // https://ubsicap.github.io/usfm/identification/books.html
  chapters: number; // Total number of chapters in the book
  versesInChapter: number[]; // Number of verses in each chapter (placeholder at 0)
  verses: number;   // Total number of verses in the book
}

//#region bookInfo: bookType[]
/**
 * Array of bookType containing information about each book
*/
export const bookInfo: bookType[] = [
  {
    // Just a placeholder. Not a valid book
    code: "000",
    name: "Placeholder",
    num: 0,
    chapters: 0,
    versesInChapter: [0],
    verses: 0
  },

  // OT
  {
    code: "GEN",
    name: "Genesis",
    num: 1,
    chapters: 50,
    versesInChapter: [0, 31, 25, 24, 26, 32, 22, 24, 22, 29, 32,
                         32, 20, 18, 24, 21, 16, 27, 33, 38, 18,
                         34, 24, 20, 67, 34, 35, 46, 22, 35, 43,
                         55, 32, 20, 31, 29, 43, 36, 30, 23, 23,
                         57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
    verses: 1533
  },
  {
    code: "EXO",
    name: "Exodus",
    num: 2,
    chapters: 40,
    versesInChapter: [0, 22, 25, 22, 31, 23, 30, 25, 32, 35, 29,
                         10, 51, 22, 31, 27, 36, 16, 27, 25, 26,
                         36, 31, 33, 18, 40, 37, 21, 43, 46, 38,
                         18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
    verses: 1213
  },
  {
    code: "LEV",
    name: "Leviticus",
    num: 3,
    chapters: 27,
    versesInChapter: [0, 17, 16, 17, 35, 19, 30, 38, 36, 24, 20,
                         47,  8, 59, 57, 33, 34, 16, 30, 37, 27,
                         24, 33, 44, 23, 55, 46, 34],
    verses: 859
  },
  {
    code: "NUM",
    name: "Numbers",
    num: 4,
    chapters: 36,
    versesInChapter: [0, 54, 34, 51, 49, 31, 27, 89, 26, 23, 36,
                         35, 16, 33, 45, 41, 50, 13, 32, 22, 29,
                         35, 41, 30, 25, 18, 65, 23, 31, 40, 16,
                         54, 42, 56, 29, 34, 13],
    verses: 1288
  },
  {
    code: "DEU",
    name: "Deuteronomy",
    num: 5,
    chapters: 34,
    versesInChapter: [0, 46, 37, 29, 49, 33, 25, 26, 20, 29, 22,
                         32, 32, 18, 29, 23, 22, 20, 22, 21, 20,
                         23, 30, 25, 22, 19, 19, 26, 68, 29, 20,
                         30, 52, 29, 12],
    verses: 959
  },
  {
    code: "JOS",
    name: "Joshua",
    num: 6,
    chapters: 24,
    versesInChapter: [0, 18, 24, 17, 24, 15, 27, 26, 35, 27, 43,
                         23, 24, 33, 15, 63, 10, 18, 28, 51,  9,
                         45, 34, 16, 33],
    verses: 658
  },
  {
    code: "JDG",
    name: "Judges",
    num: 7,
    chapters: 21,
    versesInChapter: [0, 36, 23, 31, 24, 31, 40, 25, 35, 57, 18,
                         40, 15, 25, 20, 20, 31, 13, 31, 30, 48,
                         25],
    verses: 618
  },
  {
    code: "RUT",
    name: "Ruth",
    num: 8,
    chapters: 4,
    versesInChapter: [0, 22, 23, 18, 22],
    verses: 85
  },
  {
    code: "1SA",
    name: "1 Samuel",
    num: 9,
    chapters: 31,
    versesInChapter: [0, 28, 36, 21, 22, 12, 21, 17, 22, 27, 27,
                         15, 25, 23, 52, 35, 23, 58, 30, 24, 42,
                         15, 23, 29, 22, 44, 25, 12, 25, 11, 31,
                         13],
    verses: 810
  },
  {
    code: "2SA",
    name: "2 Samuel",
    num: 10,
    chapters: 24,
    versesInChapter: [0, 27, 32, 39, 12, 25, 23, 29, 18, 13, 19,
                         27, 31, 39, 33, 37, 23, 29, 33, 43, 26,
                         22, 51, 39, 25],
    verses: 695
  },
  {
    code: "1KI",
    name: "1 Kings",
    num: 11,
    chapters: 22,
    versesInChapter: [0, 53, 46, 28, 34, 18, 38, 51, 66, 28, 29,
                         43, 33, 34, 31, 34, 34, 24, 46, 21, 43,
                         29, 53],
    verses: 816
  },
  {
    code: "2KI",
    name: "2 Kings",
    num: 12,
    chapters: 25,
    versesInChapter: [0, 18, 25, 27, 44, 27, 33, 20, 29, 37, 36,
                         21, 21, 25, 29, 38, 20, 41, 37, 37, 21,
                         26, 20, 37, 20, 30],
    verses: 719
  },
  {
    code: "1CH",
    name: "1 Chronicles",
    num: 13,
    chapters: 29,
    versesInChapter: [0, 54, 55, 24, 43, 26, 81, 40, 40, 44, 14,
                         47, 40, 14, 17, 29, 43, 27, 17, 19,  8,
                         30, 19, 32, 31, 31, 32, 34, 21, 30],
    verses: 942
  },
  {
    code: "2CH",
    name: "2 Chronicles",
    num: 14,
    chapters: 36,
    versesInChapter: [0, 17, 18, 17, 22, 14, 42, 22, 18, 31, 19,
                         23, 16, 22, 15, 19, 14, 19, 34, 11, 37,
                         20, 12, 21, 27, 28, 23,  9, 27, 36, 27,
                         21, 33, 25, 33, 27, 23],
    verses: 822
  },
  {
    code: "EZR",
    name: "Ezra",
    num: 15,
    chapters: 10,
    versesInChapter: [0, 11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
    verses: 280
  },
  {
    code: "NEH",
    name: "Nehemiah",
    num: 16,
    chapters: 13,
    versesInChapter: [0, 11, 20, 32, 23, 19, 19, 73, 18, 38, 39,
                         36, 47, 31],
    verses: 406
  },
  {
    code: "EST",
    name: "Esther",
    num: 17,
    chapters: 10,
    versesInChapter: [0, 22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
    verses: 167
  },
  {
    code: "JOB",
    name: "Job",
    num: 18,
    chapters: 42,
    versesInChapter: [0, 22, 13, 26, 21, 27, 30, 21, 22, 35, 22,
                         20, 25, 28, 22, 35, 22, 16, 21, 29, 29,
                         34, 30, 17, 25,  6, 14, 23, 28, 25, 31,
                         40, 22, 33, 37, 16, 33, 24, 41, 30, 24,
                         34, 17],
    verses: 1070
  },
  {
    code: "PSA",
    name: "Psalms",
    num: 19,
    chapters: 150,
    versesInChapter: [0,  6, 12,  8,  8, 12, 10, 17,  9, 20, 18,
                          7,  8,  6,  7,  5, 11, 15, 50, 14,  9,
                         13, 31,  6, 10, 22, 12, 14,  9, 11, 12,
                         24, 11, 22, 22, 28, 12, 40, 22, 13, 17,
                         13, 11,  5, 26, 17, 11,  9, 14, 20, 23,

                         // 51-100
                         19,  9,  6,  7, 23, 13, 11, 11, 17, 12,
                          8, 12, 11, 10, 13, 20,  7, 35, 36,  5,
                         24, 20, 28, 23, 10, 12, 20, 72, 13, 19,
                         16,  8, 18, 12, 13, 17,  7, 18, 52, 17,
                         16, 15,  5, 23, 11, 13, 12,  9,  9,  5,

                         // 101-150
                          8, 28, 22, 35, 45, 48, 43, 13, 31,  7,
                         10, 10,  9,  8, 18, 19,  2, 29, 176, 7,
                          8,  9,  4 , 8,  5,  6,  5,  6,  8,  8,
                          3, 18,  3,  3, 21, 26,  9,  8, 24, 13,
                         10,  7, 12, 15, 21, 10, 20, 14, 9, 6],
    verses: 2461
  },
  {
    code: "PRO",
    name: "Proverbs",
    num: 20,
    chapters: 31,
    versesInChapter: [0, 33, 22, 35, 27, 23, 35, 27, 36, 18, 32,
                         31, 28, 25, 35, 33, 33, 28, 24, 29, 30,
                         31, 29, 35, 34, 28, 28, 27, 28, 27, 33,
                         31],
    verses: 915
  },
  {
    code: "ECC",
    name: "Ecclesiastes",
    num: 21,
    chapters: 12,
    versesInChapter: [0, 18, 26, 22, 16, 20, 12, 29, 17, 18, 20,
                         10, 14],
    verses: 222
  },
  {
    code: "SNG",
    name: "Song of Songs",
    num: 22,
    chapters: 8,
    versesInChapter: [0, 17, 17, 11, 16, 16, 13, 13, 14],
    verses: 117
  },
  {
    code: "ISA",
    name: "Isaiah",
    num: 23,
    chapters: 66,
    versesInChapter: [0, 31, 22, 26,  6, 30, 13, 25, 22, 21, 34,
                         16,  6, 22, 32,  9, 14, 14,  7, 25,  6,
                         17, 25, 18, 23, 12, 21, 13, 29, 24, 33,
                          9, 20, 24, 17, 10, 22, 38, 22,  8, 31,
                         29, 25, 28, 28, 25, 13, 15, 22, 26, 11,
                         23, 15, 12, 17, 13, 12, 21, 14, 21, 22,
                         11, 12, 19, 12, 25, 24],
    verses: 1292
  },
  {
    code: "JER",
    name: "Jeremiah",
    num: 24,
    chapters: 52,
    versesInChapter: [0, 19, 37, 25, 31, 31, 30, 34, 22, 26, 25,
                         23, 17, 27, 22, 21, 21, 27, 23, 15, 18,
                         14, 30, 40, 10, 38, 24, 22, 17, 32, 24,
                         40, 44, 26, 22, 19, 32, 21, 28, 18, 16,
                         18, 22, 13, 30,  5, 28,  7, 47, 39, 46,
                         64, 34],
    verses: 1364
  },
  {
    code: "LAM",
    name: "Lamentations",
    num: 25,
    chapters: 5,
    versesInChapter: [0, 22, 22, 66, 22, 22, ],
    verses: 154
  },
  {
    code: "EZK",
    name: "Ezekiel",
    num: 26,
    chapters: 48,
    versesInChapter: [0, 28, 10, 27, 17, 17, 14, 27, 18, 11, 22,
                         25, 28, 23, 23,  8, 63, 24, 32, 14, 49,
                         32, 31, 49, 27, 17, 21, 36, 26, 21, 26,
                         18, 32, 33, 31, 15, 38, 28, 23, 29, 49,
                         26, 20, 27, 31, 25, 24, 23, 35],
    verses: 1273
  },
  {
    code: "DAN",
    name: "Daniel",
    num: 27,
    chapters: 12,
    versesInChapter: [0, 21, 49, 30, 37, 31, 28, 28, 27, 27, 21,
                         45, 13],
    verses: 357
  },
  {
    code: "HOS",
    name: "Hosea",
    num: 28,
    chapters: 14,
    versesInChapter: [0, 11, 23,  5, 19, 15, 11, 16, 14, 17, 15,
                         12, 14, 16,  9],
    verses: 197
  },
  {
    code: "JOL",
    name: "Joel",
    num: 29,
    chapters: 3,
    versesInChapter: [0, 20, 32, 21],
    verses: 73
  },
  {
    code: "AMO",
    name: "Amos",
    num: 30,
    chapters: 9,
    versesInChapter: [0, 15, 16, 15, 13, 27, 14, 17, 14, 15],
    verses: 146
  },
  {
    code: "OBA",
    name: "Obadiah",
    num: 31,
    chapters: 1,
    versesInChapter: [0, 21],
    verses: 21
  },
  {
    code: "JON",
    name: "Jonah",
    num: 32,
    chapters: 4,
    versesInChapter: [0, 17, 10, 10, 11],
    verses: 48
  },
  {
    code: "MIC",
    name: "Micah",
    num: 33,
    chapters: 7,
    versesInChapter: [0, 16, 13, 12, 13, 15, 16, 20],
    verses: 105
  },
  {
    code: "NAM",
    name: "Nahum",
    num: 34,
    chapters: 3,
    versesInChapter: [0, 15, 13, 19],
    verses: 47
  },
  {
    code: "HAB",
    name: "Habakkuk",
    num: 35,
    chapters: 3,
    versesInChapter: [0, 17, 20, 19],
    verses: 56
  },
  {
    code: "ZEP",
    name: "Zephaniah",
    num: 36,
    chapters: 3,
    versesInChapter: [0, 18, 15, 20],
    verses: 53
  },
  {
    code: "HAG",
    name: "Haggai",
    num: 37,
    chapters: 2,
    versesInChapter: [0, 15, 23],
    verses: 38
  },
  {
    code: "ZEC",
    name: "Zechariah",
    num: 38,
    chapters: 14,
    versesInChapter: [0, 21, 13, 10, 14, 11, 15, 14, 23, 17, 12,
                         17, 14,  9, 21],
    verses: 211
  },
  {
    code: "MAL",
    name: "Malachi",
    num: 39,
    chapters: 4,
    versesInChapter: [0, 14, 17, 18, 6],
    verses: 55
  },

  // NT
  {
    code: "MAT",
    name: "Matthew",
    num: 41,
    chapters: 28,
    versesInChapter: [0, 25, 23, 17, 25, 48, 34, 29, 34, 38, 42,
                         30, 50, 58, 36, 39, 28, 27, 35, 30, 34,
                         46, 46, 39, 51, 46, 75, 66, 20],
    verses: 1071
  },
  {
    code: "MRK",
    name: "Mark",
    num: 42,
    chapters: 16,
    versesInChapter: [0, 45, 28, 35, 41, 43, 56, 37, 38, 50, 52,
                         33, 44, 37, 72, 47, 20],
    verses: 678
  },
  {
    code: "LUK",
    name: "Luke",
    num: 43,
    chapters: 24,
    versesInChapter: [0, 80, 52, 38, 44, 39, 49, 50, 56, 62, 42,
                         54, 59, 35, 35, 32, 31, 37, 43, 48, 47,
                         38, 71, 56, 53],
    verses: 1151
  },
  {
    code: "JHN",
    name: "John",
    num: 44,
    chapters: 21,
    versesInChapter: [0, 51, 25, 36, 54, 47, 71, 53, 59, 41, 42,
                         57, 50, 38, 31, 27, 33, 26, 40, 42, 31,
                         25],
    verses: 879
  },
  {
    code: "ACT",
    name: "Acts",
    num: 45,
    chapters: 28,
    versesInChapter: [0, 26, 47, 26, 37, 42, 15, 60, 40, 43, 48,
                         30, 25, 52, 28, 41, 40, 34, 28, 41, 38,
                         40, 30, 35, 27, 27, 32, 44, 31],
    verses: 1007
  },
  {
    code: "ROM",
    name: "Romans",
    num: 46,
    chapters: 16,
    versesInChapter: [0, 32, 29, 31, 25, 21, 23, 25, 39, 33, 21,
                         36, 21, 14, 23, 33, 27],
    verses: 433
  },
  {
    code: "1CO",
    name: "1 Corinthians",
    num: 47,
    chapters: 16,
    versesInChapter: [0, 31, 16, 23, 21, 13, 20, 40, 13, 27, 33,
                         34, 31, 13, 40, 58, 24],
    verses: 437
  },
  {
    code: "2CO",
    name: "2 Corinthians",
    num: 48,
    chapters: 13,
    versesInChapter: [0, 24, 17, 18, 18, 21, 18, 16, 24, 15, 18,
                         33, 21, 14],
    verses: 257
  },
  {
    code: "GAL",
    name: "Galatians",
    num: 49,
    chapters: 6,
    versesInChapter: [0, 24, 21, 29, 31, 26, 18],
    verses: 149
  },
  {
    code: "EPH",
    name: "Ephesians",
    num: 50,
    chapters: 6,
    versesInChapter: [0, 23, 22, 21, 32, 33, 24],
    verses: 155
  },
  {
    code: "PHP",
    name: "Philippians",
    num: 51,
    chapters: 4,
    versesInChapter: [0, 30, 30, 21, 23],
    verses: 104
  },
  {
    code: "COL",
    name: "Colossians",
    num: 52,
    chapters: 4,
    versesInChapter: [0, 29, 23, 25, 18],
    verses: 95
  },
  {
    code: "1TH",
    name: "1 Thessalonians",
    num: 53,
    chapters: 5,
    versesInChapter: [0, 10, 20, 13, 18, 28],
    verses: 89
  },
  {
    code: "2TH",
    name: "2 Thessalonians",
    num: 54,
    chapters: 3,
    versesInChapter: [0, 12, 17, 18],
    verses: 47
  },
  {
    code: "1TI",
    name: "1 Timothy",
    num: 55,
    chapters: 6,
    versesInChapter: [0, 20, 15, 16, 16, 25, 21],
    verses: 113
  },
  {
    code: "2TI",
    name: "2 Timothy",
    num: 56,
    chapters: 4,
    versesInChapter: [0, 18, 26, 17, 22],
    verses: 83
  },
  {
    code: "TIT",
    name: "Titus",
    num: 57,
    chapters: 3,
    versesInChapter: [0, 16, 15, 15],
    verses: 46
  },
  {
    code: "PHM",
    name: "Philemon",
    num: 58,
    chapters: 1,
    versesInChapter: [0, 25],
    verses: 25
  },
  {
    code: "HEB",
    name: "Hebrews",
    num: 59,
    chapters: 13,
    versesInChapter: [0, 14, 18, 19, 16, 14, 20, 28, 13, 28, 39,
                         40, 29, 25],
    verses: 303
  },
  {
    code: "JAS",
    name: "James",
    num: 60,
    chapters: 5,
    versesInChapter: [0, 27, 26, 18, 17, 20],
    verses: 108
  },
  {
    code: "1PE",
    name: "1 Peter",
    num: 61,
    chapters: 5,
    versesInChapter: [0, 25, 25, 22, 19, 14],
    verses: 105
  },
  {
    code: "2PE",
    name: "2 Peter",
    num: 62,
    chapters: 3,
    versesInChapter: [0, 21, 22, 18],
    verses: 61
  },
  {
    code: "1JN",
    name: "1 John",
    num: 63,
    chapters: 5,
    versesInChapter: [0, 10, 29, 24, 21, 21],
    verses: 105
  },
  {
    code: "2JN",
    name: "2 John",
    num: 64,
    chapters: 1,
    versesInChapter: [0, 13],
    verses: 13
  },
  {
    code: "3JN",
    name: "3 John",
    num: 65,
    chapters: 1,
    versesInChapter: [0, 15],
    verses: 15
  },
  {
    code: "JUD",
    name: "Jude",
    num: 66,
    chapters: 1,
    versesInChapter: [0, 25],
    verses: 25
  },
  {
    code: "REV",
    name: "Revelation",
    num: 67,
    chapters: 22,
    versesInChapter: [0, 20, 29, 22, 11, 14, 17, 17, 13, 21, 11,
                         19, 17, 18, 20,  8, 21, 18, 24, 21, 15,
                         27, 21],
    verses: 404
  },

  // Extra books for logging
  {
    code: "XXA",
    name: "Extra Book A",
    num: 94,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXB",
    name: "Extra Book B",
    num: 95,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXC",
    name: "Extra Book C",
    num: 96,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXD",
    name: "Extra Book D",
    num: 97,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXE",
    name: "Extra Book E",
    num: 98,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXF",
    name: "Extra Book F",
    num: 99,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  },
  {
    code: "XXG",
    name: "Extra Book G",
    num: 100,
    chapters: 999,
    versesInChapter: [0],
    verses: 0
  }
];
//#endregion

/**
 * Description of the unit within a chapter.
 */
export type unitSubtype =
  "padding" |
  "chapter" |
  "verse" |
  "section";

export interface unitType {
  type: unitSubtype,
  number: number,    // Used for section level, verse number, or start of a verse bridge
  bridgeEnd?: number,  // When used, marks the end of a verse bridge
  content?: any,
  text?: string
}

export interface objType {
  header: {
    projectName: string,
    bookInfo:  bookType
  },
  content: unitType[]
}

export const PLACEHOLDER_BOOK: bookType = bookInfo[0];
export const PLACEHOLDER_BOOK_OBJ: objType = {
  "header": {
    "projectName" : "",
    "bookInfo" : PLACEHOLDER_BOOK
  },
  "content": []
}

/**
   * Get the book information given the 3-character book code
   * @param {CodeType} bookCode
   * @returns {bookType}
   */
export function getBookByCode(bookCode: CodeType): bookType {
  const book : bookType = bookInfo.find(b => b.code === bookCode) as bookType;
  if (book === undefined) {
    console.error(`getBookByCode() failed for book code: ${bookCode}`);
    process.exit(1);
  }
  return book;
}

/**
 * Test utility to count the number of verses in each chapter
 */
export function countVerses() {
  bookInfo.forEach(b => {
    if (b.versesInChapter) {
      let totalVerses = 0;
      b.versesInChapter.forEach(v => {
        totalVerses += v;
      })
      if (totalVerses != b.verses) {
        console.error(`${b.name} counted ${totalVerses} but should be ${b.verses}`);
      }
    }
  });
}

/**
 * Get the book information given the book name.
 * Also handles typos / alternate spellings in book name
 * @param {string} name of the book
 * @returns {bookType} Information about the book
 */
export function getBookByName(name: string): bookType {
  let bookName: string;
  // Override typos/alternate spellings in book name
  // TODO: are aNames or xNames to be ignored?
  switch(name) {
    // OT
    case 'Dueteronomy':
      bookName = 'Deuteronomy';
      break;
    case '1Samuel':
      bookName = '1 Samuel';
      break;
    case '2Samuel':
      bookName = '2 Samuel';
      break;
    case '1Kings':
      bookName = '1 Kings';
      break;
    case '2Kings':
      bookName = '2 Kings';
      break;
    case 'Song of Solomon':
      bookName = 'Song of Songs';
      break;
    case 'jonah':
      bookName = 'Jonah';
      break;
    case 'Zachariah':
      bookName = 'Zechariah';
      break;

    // NT
    case 'aMatthew':
    case 'Matth':
        bookName = 'Matthew';
      break;
    case 'aLuke':
    case 'luke':
      bookName = 'Luke';
      break;
    case 'aActs':
      bookName = 'Acts';
      break;
    case 'Rom':
      bookName = 'Romans';
      break;
    case 'I Corinthians':
    case '1Corinthians':
    case 'x1Corinthians':
    case '1 Cor':  
      bookName = "1 Corinthians";
      break;
    case '2Corinthians':
    case '2 Cor':
      bookName = '2 Corinthians';
      break;
    case 'Gal':
      bookName = 'Galatians';
      break;
    case 'Eph':
      bookName = 'Ephesians';
      break;
    case 'Col':
      bookName = 'Colossians';
      break;
    case 'Phil':
      bookName = 'Philippians';
      break;  
    case '1Thessalonians':
    case '1 Thess':       
      bookName = '1 Thessalonians';
      break;
    case '2Thessalonians':
    case '2 Thess':
      bookName = '2 Thessalonians';
      break;
    case '1Timothy':
    case '1 Tim':  
      bookName = '1 Timothy';
      break;
    case '2Timothy':
    case '2 Tim':
      bookName = '2 Timothy';
      break;
    case '1Peter':
    case '1 Pet':  
      bookName = '1 Peter';
      break;
    case '2Peter':
    case '2 Pet':
      bookName = '2 Peter';
      break;
    case 'Hebrew':
      bookName = 'Hebrews';
      break;
    case '1John':
      bookName = '1 John';
      break;
    case '2John':
      bookName = '2 John';
      break;
    case '3John':
      bookName = '3 John';
      break;
    case 'Rev':
      bookName = 'Revelation';
      break;
    default:
      bookName = name;
  }
  let book : bookType = bookInfo.find(b => b.name === bookName) as bookType;
  if (book === undefined) {
    console.warn(`Skipping book name: ${name}. Returning placeholder`);
    book = PLACEHOLDER_BOOK;
  }
  return book;
}

/**
 * Get the book information given the book number.
 * If the book number doesn't exist, return PLACEHOLDER_BOOK.
 * @param {number} bookNumber
 * @returns {bookType}
 */
export function getBookByNumber(bookNumber: number) : bookType {
  const book = bookInfo.find(b => b.num == bookNumber);

  if (book) {
    return book;
  } else {
    console.error(`getBookByNumber(${bookNumber}) does not exist`);
    return PLACEHOLDER_BOOK;
  }
}

