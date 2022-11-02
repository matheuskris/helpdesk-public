import * as XLSX from "xlsx/xlsx.mjs";

export const downloadTableDataInExcel = (data) => {
  // array of objects to save in Excel
  let binary_univers = data;

  let binaryWS = XLSX.utils.json_to_sheet(binary_univers);

  // Create a new Workbook
  var wb = XLSX.utils.book_new();

  // Name your sheet
  XLSX.utils.book_append_sheet(wb, binaryWS, "Dê um nome ao seu relatório");

  // export your excel
  XLSX.writeFile(wb, "Dê um nome ao seu relatório.xlsx");
};
