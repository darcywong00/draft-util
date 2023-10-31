# Draft Utils

Retrieves verses from several translations to aid in drafting.
Outputs to HTML tables which can then be imported to Google Docs.

If more versions need to be added, modify versions.json at https://github.com/glowstudent/youversion/ through a PR.

You'll find the version IDs from the path
https://www.bible.com/bible/174/GEN.1.THSV11
where `174` is the ID for `THSV11`.

## Parameters

**Required**
-b [book name or [3-character alias](https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases)]

If chapters or verses parameter not given, the entire book will be processed.

**Optional** - one of:
-c [chapter number(s) as string. Chapter range with hyphen]
-v [verse(s) as a string. Verse range with hyphen. If not specified, the entire chapter is processed]

Don't define multiple chapters and multiple verses on the same run.

## Pre-requisite
Install the current LTS of [nodejs](https://nodejs.org/).
