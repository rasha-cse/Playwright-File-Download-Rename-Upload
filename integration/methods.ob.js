const { expect } = require('@playwright/test');
const fs = require('fs');

exports.Methods = class Methods {
    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page
    }

    async download(downloadLinkText) {
        //Start waiting for download before clicking. Note no await.
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByText(downloadLinkText).click();
        const download = await downloadPromise;

        // Wait for the download process to complete and save the downloaded file somewhere.
        await download.saveAs('Downloads/' + download.suggestedFilename());
    }

    async renameAndUpload(filePrefix, data) {
        const titleText = await this.page.locator('#type').innerText();
        if (titleText.includes('Authorization')) {
            await this.page.locator('#type').selectOption('Authorization');
        }

        await this.page.locator('#receivedDate').fill('06/03/2024')

        await this.page.locator('input[value="Add File"]').click()

        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator('.input-group-addon').click(); //clicking Browse
        const fileChooser = await fileChooserPromise;

        const fileBuffer = fs.readFileSync('Downloads/' + filePrefix + data[2] + '.pdf')
        const newFileName= filePrefix + data[1] + '.pdf'

        await fileChooser.setFiles({
        name: newFileName,
        mimeType: 'application/pdf',
        buffer: fileBuffer
        });

        await this.page.locator('div[class="modal-dialog"] input[value="Upload"]').click()

        await this.page.locator('input[value="Save"]').click()

        const successMsg = await this.page.locator('div[class="alert alert-success text-center"] div strong').innerText()
        const docStorageformId = successMsg.split(' ')[2]
        return docStorageformId
    }

    async log_doc_storage_formids(rowCount, filePrefix, docStorageformId, data) {
        console.log('Row: ' + (rowCount+2) + ", " + "IFSP ID: " + data[1] + ", " + filePrefix + ": " + docStorageformId)

        fs.appendFileSync('fixtures/log_file_docStorageFormIds.log', "IFSP ID: " + data[1] + ", " + filePrefix + ": " + docStorageformId + '\n')
    }
}
