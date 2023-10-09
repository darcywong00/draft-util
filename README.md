# Draft Utils

Retrieves verses from several translations to aid in drafting.
Outputs to HTML tables which can then be imported to Google Docs.

If more versions need to be added, modify versions.json and copy to node_modules/@glowstudent/youversion/dist/

Also check if 1 John accounts for 5 chapters in books.json.

## Parameters

**Required**
-b [book name or [3-character alias](https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases)]
-c [chapter number(s) as string. Chapter range with hyphen]

**Optional** - one of:
-v [verse(s) as a string. Verse range with hyphen. If not specified, the entire chapter is processed]

Don't define multiple chapters and multiple verses on the same run.
