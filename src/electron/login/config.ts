import { LogLevel } from '@azure/msal-browser';
import { environment } from '../../environments/environment'
export const msalConfig = {
    auth: {
        clientId: environment.msalConfig.authElectron.clientIdElectron,
        authority: environment.msalConfig.authElectron.authorityElectron,
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