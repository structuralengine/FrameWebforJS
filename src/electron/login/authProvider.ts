import { AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication, SilentFlowRequest } from '@azure/msal-node';
import { shell } from 'electron';

export class AuthProvider {
    private msalConfig;
    private clientApplication : PublicClientApplication;
    account;
    cache;

    constructor(msalConfig) {
        this.msalConfig = msalConfig;
        this.clientApplication = new PublicClientApplication(this.msalConfig);
        this.cache = this.clientApplication.getTokenCache();
        this.account = null;
    }

    async login() {
        const tokenRequest: SilentFlowRequest = {
            scopes: ['User.Read'],
            account: null,
        };
        const authResponse = await this.getToken(tokenRequest);
        return this.handleResponse(authResponse);
    }

    async logout() {
        if (!this.account) return;
        try {
            await shell.openExternal(`${this.msalConfig.auth.authority}/oauth2/v2.0/logout`);
            await this.cache.removeAccount(this.account);
            this.account = null;
        } catch (error) {
            console.log(error);
        }
    }

    async getToken(
        tokenRequest: SilentFlowRequest
    ): Promise<AuthenticationResult> {
        try {
            let authResponse: AuthenticationResult;
            const account = this.account || (await this.getAccount());
            if (account) {
                tokenRequest.account = account;
                authResponse = await this.getTokenSilent(tokenRequest);
            } else {
                authResponse = await this.getTokenInteractive(tokenRequest);
            }
            this.account = authResponse.account;
            return authResponse;
        } catch (error) {
            throw error;
        }
    }

    async getTokenSilent(
        tokenRequest: SilentFlowRequest
    ): Promise<AuthenticationResult> {
        try {
            return await this.clientApplication.acquireTokenSilent(tokenRequest);
        } catch (error) {
            console.log("Silent token acquisition failed, acquiring token using pop up");
            return await this.getTokenInteractive(tokenRequest);
        }
    }

    async getTokenInteractive(tokenRequest) {
        try {
            const openBrowser = async (url) => {
                console.log(url)
                await shell.openExternal(url);
            };

            const authResponse = await this.clientApplication.acquireTokenInteractive({
                ...tokenRequest,
                openBrowser,
            });

            return authResponse;
        } catch (error) {
            throw error;
        }
    }

    async handleResponse(response) {
        if (response !== null) {
            this.account = response.account;
        } else {
            this.account = await this.getAccount();
        }

        return this.account;
    }

    async getAccount() {
        const currentAccounts = await this.clientApplication.getAllAccounts();

        if (!currentAccounts) {
            console.log('No accounts detected');
            return null;
        }

        if (currentAccounts.length > 1) {
            console.log('Multiple accounts detected, need to add choose account code.');
            return currentAccounts[0];
        } else if (currentAccounts.length === 1) {
            return currentAccounts[0];
        } else {
            return null;
        }
    }
}
