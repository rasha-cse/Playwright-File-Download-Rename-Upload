// @ts-check
const { test, expect } = require('@playwright/test');
//const readLastLines = require('read-last-lines');

const xlsx = require('xlsx');
const fs = require('fs');

const { LoginPage } = require('../integration/pageObjects/loginPage.ob.js');
const { DataPreparation } = require('../integration/dataPreparation.ob.js');
const { Methods } = require('../integration/methods.ob.js');

import path from 'path';
import superAdminData from '../fixtures/superAdminData.json';
import urlData from "../fixtures/urlData.json";

let dataPrep;
let methods;
let sheet0 = [];

test.describe.serial("Module File Download & Document Storage Upload", () => {
    let loginPage;

    let savedCookies;

    test.beforeAll(async ({ browser }) => {

      const context = await browser.newContext({ acceptDownloads: true });
      const page = await context.newPage();

      loginPage = new LoginPage(page);

      await page.goto(urlData.LoginURL, { timeout: 2 * 60 * 1000 });
      await loginPage.login(superAdminData.username, superAdminData.providerCode, superAdminData.password)
      savedCookies = await page.context().cookies()

      await context.close();
    });

    test.beforeEach(async ({ context, page }) => {
        await context.addCookies(savedCookies);
    });

test('Module File Download, Rename & Upload', async ({ page }) => {

  let start = performance.now();
  dataPrep = new DataPreparation(page);
  methods = new Methods(page);

  sheet0 = await dataPrep.readExcelDataWithSheetName('fixtures/app_module_active_indv.xlsx', 'Export Worksheet')

  //console.log(sheet0)

  const rowCount = fs.readFileSync('fixtures/log_file_processedRows.log');
  let x = rowCount.toString().split(" ").pop();//.split('/n') //.trim() //[lines.length - 1]
  let lastLineNumber = Number(x)
  console.log("Last Processed Row Number: " + lastLineNumber)


  for (let i = lastLineNumber - 1; i < sheet0.length; i++) {   // "Row: 1" in log file at start of running   //lastLineNumber - 1

  let data = sheet0[i]

  //console.log("Client ID: " + data[0])

  await page.goto(urlData.module_url + data[1]);

  await methods.download('Print Module')
  await methods.download('Print ISP')


await page.goto(urlData.doc_storage_link + data[0]) //9518097  data.client_id

const docStorageIFSPformId = await methods.renameAndUpload('Module_of_', data) 
await methods.log_doc_storage_formids(i, "Module", docStorageIFSPformId, data)

await page.getByText('Add New Document for this Individual').click()
const docStorageISPformId = await methods.renameAndUpload('ISP_of_', data) 
await methods.log_doc_storage_formids(i, "ISP", docStorageISPformId, data)

fs.appendFileSync('fixtures/log_file_processedRows.log',  "Module ID: " + data[1] + ", " + 'Row: ' + (i+2) + '\n')

let timeTaken = performance.now() - start;
console.log("Total time taken : " + timeTaken/60000 + " minutes");
  
  //await new Promise(()=>{})
  //await page.waitForTimeout(15000)
}
});
});
