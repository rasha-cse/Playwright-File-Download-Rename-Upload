// playwright-dev-page.js

const assert = require('assert');
const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {

    /**
    * @param {import('@playwright/test').Page} page
    */

    constructor(page) {
        this.page = page;
        this.getPageTitle = page.locator('head > title');
        this.getUsername = page.getByPlaceholder('Login Name');
        this.getProviderCode = page.getByPlaceholder('Provider Code')
        this.getSubmitButton = page.getByRole('button', { name: 'Continue' })
        this.getPassword = page.getByPlaceholder('Password')
        this.getLoginButton = page.getByRole('button', { name: 'Login' })
        this.getForgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' })
        this.getResetPassword = page.getByText('Reset Password')
    }

    async verifyPageTitle() {
        const pageTitleText = await this.getPageTitle.innerText()
        assert(pageTitleText.includes("Therap :: Login"));
    }

    async getContinueButton() {
        await this.getSubmitButton.click();
    }

    async login(username, providerCode, password) {
        await this.getUsername.fill(username);
        await this.getProviderCode.fill(providerCode);
        await this.getSubmitButton.click();
        await this.getPassword.fill(password);
        await this.getLoginButton.click();
    }

    async ValidateAlertDangerText(alertMessage) {
        const dangerText = await this.page.$eval('.alert.alert-danger.text-center', element => element.textContent.trim().replace(/\s/g, ''));
        expect(dangerText).toBe(alertMessage.trim().replace(/\s/g, ''));
    }

    async validateExistanceOfForgotPasswordLink() {
        await this.getForgotPasswordLink.click()
    }

    async validateExistanceOfTroubleLogging() {
        await this.getTroubleLoggingIn.click()
        const locator = await this.page.frameLocator('#troubleLoggingHelpUrl').getByText('Self Password Reset Enabled?').innerText()
        assert(locator.includes('Self Password Reset Enabled?'));

    }
}