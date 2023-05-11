import * as XLSX from "xlsx";

function cleanCsvString(str, removeDuplicates) {
  // default to true
  removeDuplicates = removeDuplicates === undefined ? true : removeDuplicates;

  // go through each item
  return String(str)
    .split(",")
    .map(function (item) {
      // trim value
      return String(item).trim();
    })
    .filter(function (item, index, all) {
      if (removeDuplicates) {
        // remove empty items & duplicate values
        return item !== "" && index === all.indexOf(item);
      }

      return item;
    })
    .join(",");
}

export async function excelToText(fileData) {
  const workbook: XLSX.WorkBook = XLSX.read(fileData, { type: "buffer" });
  const sheetName: string = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

  // Convert the worksheet to a text string
  const text: any = XLSX.utils.sheet_to_json(worksheet);

  return text.reduce((acc, current) => {
    return `${acc}
${Object.entries(current)
  .map(([key, val]) => `${key}: ${val}`)
  .join(",")}
`;
  }, "");
}
