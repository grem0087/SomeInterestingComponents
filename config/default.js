const packageJson = require('../package.json');

const PROJECT_NAME = process.env.PROJECT_NAME || packageJson['alfa:meta'].name;
const CONTEXT_ROOT = process.env.NODE_ENV === 'production' ? process.env.CONTEXT_ROOT : '/';
const ECO_REDIRECT_HOST = process.env.ECO_REDIRECT_HOST || 'localhost';
const ECO_REDIRECT_PROTOCOL = process.env.ECO_REDIRECT_PROTOCOL || '';
const SERVICES_HOST = process.env.HOST || process.env.SERVICES_HOST || 'ufrmstest1';
const REST_SERVICES_PORT = process.env.REST_SERVICES_PORT || 80;
const USE_VERSIONS = false;
const APP_PORT = process.env.APP_PORT || 8080;
const LOGSTASH_SYSLOG_TAGS = process.env.LOGSTASH_SYSLOG_TAGS || '';
const APP_HOST = process.env.HOST || 'localhost';
const REST_SERVICES_PROTOCOL = process.env.REST_SERVICES_PROTOCOL || 'http';
const AUTH_JWT = process.env.AUTH_JWT || 'http://vc2pipet7:48601/SLJsonWebTokenWrapper';
const AUTH_PAGE = process.env.AUTH_PAGE || 'http://vlkws6:9081/webclient/pages';
const AUTH_DEV_ACCESS = process.env.AUTH_DEV_ACCESS !== '0';
const EXTERNAL_SYSTEM_CODE = process.env.EXTERNAL_SYSTEM_CODE || 'LKB01';
const ALBO_EXTERNAL_SYSTEM_CODE = process.env.ALBO_EXTERNAL_SYSTEM_CODE || 'LKB01';

const SERVICES = {
    templates: {
        name: 'templates-api',
        endpoint: 'tfp-middle-templates/api/v1/templates',
        port: REST_SERVICES_PORT
    },
    orders: {
        name: 'orders-api',
        endpoint: 'tfp-middle-orders/api/v1/orders',
        port: REST_SERVICES_PORT
    },
    dictionaries: {
        name: 'dictionaries-api',
        endpoint: 'tfp-middle-dictionaries/api/v1/dictionaries',
        port: REST_SERVICES_PORT
    },
    organizations: {
        name: 'organizations-api',
        endpoint: 'tfp-organizations-api/tapi/v2/organizations'
    },
    clients: {
        name: 'clients-api',
        endpoint: 'tfp-middle-orders/api/v1/clients',
        port: REST_SERVICES_PORT
    },
    profiles: {
        name: 'profiles-api',
        endpoint: 'tfp-profiles-api/tapi/profiles'
    },
    attachments: {
        name: 'attachments-api',
        endpoint: 'tfp-middle-orders/api/v1/attachfiles'
    }
};

const config = {
    server: {
        port: 8080
    },
    buildConfig: {
        targetDir: '.build',
        assetsDir: 'assets'
    },
    proxyAssets: {
        host: 'localhost',
        port: 9090
    },
    devtools: true,
    mocks: {
        auth: false,
        signature: false
    },
    csp: {},
    app: {
        alfaMetricsId: PROJECT_NAME,
        projectName: PROJECT_NAME,
        authPage: AUTH_PAGE,
        contextRoot: CONTEXT_ROOT,
        version: packageJson.version,
        ecoRedirect: {
            protocol: ECO_REDIRECT_PROTOCOL,
            host: ECO_REDIRECT_HOST,
            dashboard: `${CONTEXT_ROOT}/eco/dashboard`,
            paylist: `${CONTEXT_ROOT}/eco/paylist`,
            payhub: `${CONTEXT_ROOT}/eco/payhub`,
            rpay: `${CONTEXT_ROOT}/eco/payment`,
            tariffs: `${CONTEXT_ROOT}/eco/tariffs`
        }
    },
    // http://confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=211214981
    attachments: {
        maxFilesAmount: 10,
        maxFileSize: 7 * 1024 * 1024, // 7mb
        allowedExtensions: '.pdf, .xls, .xlsx, .doc, .docx, .tif, .jpg, .jpeg, .png'
    },
    auth: {
        tokenCookie: 'token',
        tokenParam: 'token',
        devAccessParam: 'profileId',
        devAccessCookie: 'profileId',
        devAccess: AUTH_DEV_ACCESS,
        jwt: AUTH_JWT,
        authPage: AUTH_PAGE
    },
    logger: {
        local: true,
        app_id: 'tfp-ui',
        app_host: APP_HOST,
        customer_id_header_name: 'x-user-id',
        app_port: APP_PORT,
        elastic_index_name: 'tfp-ui',
        rsyslog_host: APP_HOST,
        rsyslog_port: APP_PORT,
        rsyslog_tag: LOGSTASH_SYSLOG_TAGS
    },
    signature: {
        middleUrl: 'http://signorcdev1/corp-sign',
        systemName: 'tf',
        headers: {
            'X-Marathon-App-Id': '/corp-sign/corp-sign-api',
            Authorization: 'Basic dGY6OTU4MjA4OGY0YjVhNTljNjMwMDJmYjFkMWI3M2YxNjQ='
        }
    },
    services: Object.keys(SERVICES).reduce((result, serviceName) => {
        const service = SERVICES[serviceName];
        const versionString = USE_VERSIONS ? `-v${service.version}` : '';

        result[serviceName] = Object.assign({}, service, {
            host: service.host || SERVICES_HOST,
            port: process.env.APP_MOCKS ? 3030 : service.port,
            protocol: REST_SERVICES_PROTOCOL,
            healthCheck:
            `/${PROJECT_NAME}-${service.name}${versionString}/admin/health`
        });

        return result;
    }, {}),
    externalSystemCode: EXTERNAL_SYSTEM_CODE,
    alboExternalSystemCode: ALBO_EXTERNAL_SYSTEM_CODE
};

config.services.sharedUI = {
    host: APP_HOST,
    endpoint: '/corp-shared-ui'
};

config.services.organizationsFeatures = {
    host: (!process.env.APP_MOCKS && APP_HOST) || 'localhost',
    port: process.env.APP_MOCKS && 3030,
    endpoint: '/corp-support-white-lists/org-api',
    healthCheck: '/corp-support-white-lists/admin/health'
};

module.exports = config;