module.exports = {
    auth: {
        devAccess: true
    },
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
    app: {
        contextRoot: ''
    },
    csp: {},
    mocks: {
        signature: true,
        profile: true,
        organizations: true,
        dictionaries: true,
        systemName: 'tfDev'
    }
};