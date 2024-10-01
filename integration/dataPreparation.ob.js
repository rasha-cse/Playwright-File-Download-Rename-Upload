const assert = require('assert');
const { expect } = require('@playwright/test');
const xlsx = require('xlsx');

exports.DataPreparation = class DataPreparation {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page
    }

    async readExcelData(filePath, sheetIndex) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[sheetIndex];
        const sheet = workbook.Sheets[sheetName];
        let rows = xlsx.utils.sheet_to_csv(sheet).split('\n').map(row => row.split(','));
        return rows.slice(1);
    }

    async readExcelDataWithSheetName(filePath, sheetName) {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[sheetName];
        if(!sheet){
            throw new Error(`Sheet '${sheetName}' not found in the workbook.`)
        }
        let rows = xlsx.utils.sheet_to_csv(sheet).split('\n').map(row => row.split(','));
        return rows.slice(1);
    }

    async readSheet(filePath, sheetIndex) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[sheetIndex];
        const sheet = workbook.Sheets[sheetName];
        //let rows = xlsx.utils.sheet_to_csv(sheet).split('\n').map(row => row.split(','));
        return sheet;
    }
}