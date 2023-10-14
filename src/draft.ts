// Copyright 2023 SIL International
// Types used to hold drafting texts

// Object to hold multiple versions for a single verse
export type draftObjType = {
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

export const DEFAULT_DRAFT_OBJ : draftObjType = {
  THSV11 : "",
  TNCV : "",
  THAERV : "",
  NTV : "",
  ESV : "",
  NODTHNT: "",

  SBLG : "",
}

// Translation IDs and names to use in tables
// IDs need to match node_models/@glowstudent/youversion/dist/versions.json
// Only include versions that will be queried
export const VERSION_TYPE = {
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
}
