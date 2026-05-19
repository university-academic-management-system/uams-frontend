import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file (.xlsx)
 * @param data Array of objects representing the rows
 * @param fileName Name of the file to be saved (without extension)
 * @param sheetName Name of the worksheet
 */
export const exportToExcel = (data: Record<string, unknown>[], fileName: string, sheetName: string = 'Sheet1') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};