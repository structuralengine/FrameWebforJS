import { LogLevel } from '@azure/msal-browser';
import { environment } from '../../environments/environment'
export const msalConfig = {
    auth: {
        clientId: environment.msalConfig.authElectron.clientId,
        authority: environment.b2cPolicies.authorities.signUpSignIn.authority,
        redirectUri: environment.msalConfig.authElectron.redirectUri,
        postLogoutRedirectUri: environment.msalConfig.authElectron.postLogoutRedirectUri,
        knownAuthorities: [environment.b2cPolicies.authorityDomain]
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        },
    },
};