const { test, expect } = require('@playwright/test');

const xlsx = require('xlsx');
const fs = require('fs');
var zl = require("zip-lib");

const { LoginPage } = require('../integration/pageObjects/loginPage.ob.js');
const { DataPreparation } = require('../integration/dataPreparation.ob.js');
const { Methods } = require('../integration/methods.ob.js');

import path from 'path';
import superAdminData from '../fixtures/superAdminData.json';
import urlData from "../fixtures/urlData.json";

let dataPrep;
let methods;
let sheet0 = [];

test.describe.serial("IFSP Download & Document Storage Upload", () => {
    let loginPage;

    let savedCookies;

    test.beforeAll(async ({ browser }) => {

      const context = await browser.newContext({ acceptDownloads: true });
      const page = await context.newPage();

      loginPage = new LoginPage(page);

      await page.goto(urlData.LoginURL, {waitUntil: "domcontentloaded"}); //{ timeout: 2 * 60 * 1000 } 
      await loginPage.login(superAdminData.username, superAdminData.providerCode, superAdminData.password)
      //expect(await page.url()).toContain('newfpage/admin');
      savedCookies = await page.context().cookies()

      //console.log("inside beforeALL")

      await context.close();
    });

    test.beforeEach(async ({ context, page }) => {
        await context.addCookies(savedCookies);

        //console.log("inside beforeEach")
    });

test('IFSP Download', async ({ page }) => {
  //console.log("inside test")

  let start = performance.now();
  dataPrep = new DataPreparation(page);
  methods = new Methods(page);


  await page.goto(urlData.ifsp_url + "60757845");

//   fs.mkdir('Downloads/apple', { recursive: true }, (err) => {
//     if (err) throw err;
// });

const attachments = await page.locator("#fileAttachmentDiv").locator('div')

console.log(await attachments.count());

for (let i = 0; i < await attachments.count(); i++) {
  //await attachments.nth(i).click();
  console.log(await attachments.nth(i).textContent());
}

for (let i = 0; i < await attachments.count(); i++) {
////------------------------- file download
  const downloadPromise = page.waitForEvent('download');
  //await page.getByText("sample_file_name.pdf").first().click();
  
    //await attachments.nth(i).click();
    //console.log(await attachments.nth(i).textContent());
  await page.locator("#fileAttachmentDiv").locator('div').getByRole("link").nth(i).click();
  const myFile = "new_name" + i +".pdf"
  
  const download = await downloadPromise;

  await download.saveAs('Downloads/apple/' + myFile ); //+ download.suggestedFilename()
}
////------------------------- file download

zl.archiveFolder("Downloads/apple", "Downloads/apple.zip")//.then(function () {


//await page.waitForTimeout(15000)

});
});