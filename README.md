# Draft Utils

Retrieves verses from several translations to aid in drafting.
Outputs to HTML tables.

If more versions need to be added, modify versions.json and copy to node_modules/@glowstudent/youversion/dist/

Parameters
```bash
    Required
    -b [book name (can be [3-character alias](https://github.com/Glowstudent777/YouVersion-API-NPM#books-and-aliases))]
    -c [chapter number as string]

    Optional - one of:
    -v [verse(s) as a string. Verse range with hyphen. If not specified, the entire chapter is processed]
```

