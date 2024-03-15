const CONFIG = {

    // declare the applicable environment to use for bridge and phoenix
    // values identify which key in the api production/staging/dev to use in requests
    env: {
        bridge: 'production',
        phoenix: 'production',
        learn: 'production'
    },

    // api specific configs
    api: {
        // rccl bridge
        bridge: {
            // remote request helper allows you to override api version on a per request level. if null, this value is used
            defaultVersion: '2',
            // production host - no trailing forward slash and exclude version
            production: 'https://bridge.myclubroyal.co.uk/api',
            // staging host - no trailing forward slash and exclude version
            staging: 'https://rccl-bridge.stagingci.co.uk/api',
            // dev host - no trailing forward slash and exclude version
            dev: '',
        },
        // phoenix (hub and rewards to be specific)
        phoenix: {
            // remote request helper allows you to override api version on a per request level. if null, this value is used
            defaultVersion: '',
            // production host - no trailing forward slash and exclude version
            production: 'https://*.myclubroyal.co.uk',
            // staging host - no trailing forward slash and exclude version
            staging: 'https://*.phoenixcms.co.uk',
            // dev host - no trailing forward slash and exclude version
            dev: '',
        },
        // e-learning platform
        learn: {
            // learn does not currently seem to support api versioning, but I'll treat as if it might in future [eye roll]
            defaultVersion: '',
            // production host - no trailing forward slash and exclude version
            production: 'https://app.myclubroyal.co.uk/api',
            // staging host - no trailing forward slash and exclude version
            staging: 'https://rccl-elearning.stagingci.co.uk/api',
            // dev - that's up to you kiddo
            dev: '',
        }
    },

    // assets
    assets: {
        host: {
            // the learn api provides relative asset paths only.
            learn: {
                // production host - no trailing forward slash and exclude version
                production: 'https://learn.myclubroyal.co.uk',
                // staging host - no trailing forward slash and exclude version
                staging: 'http://rccl-elearning.stagingci.co.uk',
            },
            // NOT REQUIRED asset host is supplied dynamically by the phoenix /site/meta request
            phoenix: {
                production: null,
                staging: null
            },
            // NOT REQUIRED bridge currently returns complete absolute urls for all assets
            bridge: {
                production: null,
                staging: null
            }
        }
    },

    // nativve app storage keys
    mastercard3DS: {
        production: 'https://bridge.myclubroyal.co.uk/3d-secure/api/v1/authorisation-challenges/',
        staging: 'https://rccl-bridge.stagingci.co.uk/3d-secure/api/v1/authorisation-challenges/',
    },

    // storage values
    storage: {
        key: {
            storedPasscodeKey: '@_AUTH_PASSCODE',
            storedMemorableWordKey: '@_AUTH_MEMWORD',
            storedBiometricKey: '@_AUTH_BIOMETRIC',
            stored2FACodeKey: '@_AUTH_2FACODE',
            storedAccessTokenKey: '@_AUTH_ACESS_TOKEN',
            storedSSOKeyKey: '@_AUTH_SSO_KEY',
            storedPhoenixCsrfTokenKey: '@_AUTH_PHOENIX_CSRF',
            storedPhoenixAssetPathKey: '@_PHNX_ASSET_PATH',
            storedRegTagKey: '@_PHNX_REG_TAG',
            errorLoggingEnabled: '@_ERROR_LOGGING_ENABLED',
            errorLogs: '@_ERROR_LOGS',
            cardInWallet: '@RC_CARD_IN_WALLET_T3',
            cardInGwalletToken: '@RC_CARD_IN_GW_TOKEN',
            applePaySkippedKey: '@_APPLEPAY_SKIPPED',
            storedTempRegDataKey: '@_REG_TEMP_PAYLOAD',
            learnModulePartTimer: '@_LEARN_TIMER_',
            /*
            code_access_token: '@RC_TOKEN:code_access_token',
            access_token: '@RC_TOKEN:access_token',
            user: '@RC_USER',
            account_details: '@RC_ACCOUNT_DETAILS',
            card_in_wallet: '@RC_CARD_IN_WALLET_T3',
            card_in_gwallet_token: '@RC_CARD_IN_GW_TOKEN'
            */
            storedChallengeHistoryKey: '@_CHALLENGE_HISTORY',
            pusherInitiatedKey: '@_PUSHER_INIT',
        }
    },

    // pusher beams
    pusherBeams: {
        instanceId: "2521b546-dd06-41a9-bd60-ca870c432553",
        authUrl: {
            production: 'https://bridge.myclubroyal.co.uk/api/v1/accounts/push-notifications-token',
            staging: 'https://rccl-bridge.stagingci.co.uk/api/v1/accounts/push-notifications-token',
        }
    },

    // security settings
    security: {
        // array of whitelisted email hosts for dev mode access
        internalEmailHosts: [
            'cigroup.co.uk',
            'rccl.com',
        ],
        // mecahnism for side stepping the SAML/SSO browser authenticating when a user traverses from hub to rewards.
        // this api key needs to be supplied with all requests using the property `api_key`.
        // back end implemented by Sean.
        phoenixAuthApiKey: {
            staging: '12345',
            production: 'b0f1a172-a2d1-4355-bdad-272f9ad03926',
        }
    },



};

export default CONFIG;
