export const AUTH = {
    noauth: '无需认证',
    kv: '私密键值对',
    bearer: 'Bearer auth认证',
    basic: 'Basic auth认证',
    digest: 'Digest auth认证',
    oauth1: 'OAuth 1.0',
    // oAuth2: 'OAuth 2.0',
    hawk: 'Hawk authentication',
    awsv4: 'AWS Signature',
    ntlm: 'NTLM Authentication [Beta]',
    edgegrid: 'Akamai EdgeGrid', // edgegrid
}; // 认证方式

export const defaultAuth = {
    type: 'noauth',
    kv: { key: '', value: '' },
    bearer: { key: '' },
    basic: { username: '', password: '' },
    digest: {
        username: '',
        password: '',
        realm: '',
        nonce: '',
        algorithm: '', // default MD5/ emum ['MD5', 'MD5-sess', "SHA-256", "SHA-256-sess", "SHA-512-256" and "SHA-512-256-sess"]
        qop: '', // default auth
        nc: '',
        cnonce: '',
        opaque: '',
    },
    hawk: {
        authId: '',
        authKey: '',
        algorithm: '', // default sha256/ emum ['sha256', 'sha1']
        user: '',
        nonce: '',
        extraData: '',
        app: '',
        delegation: '',
        timestamp: '',
        includePayloadHash: -1,
    },
    awsv4: {
        accessKey: '',
        secretKey: '',
        region: '', // default us-east-1
        service: '', // default s3
        sessionToken: '',
        addAuthDataToQuery: -1,
    },
    ntlm: {
        username: '',
        password: '',
        domain: '',
        workstation: '',
        disableRetryRequest: 1,
    },
    edgegrid: {
        accessToken: '',
        clientToken: '',
        clientSecret: '',
        nonce: '',
        timestamp: '',
        baseURi: '',
        headersToSign: '',
    },
    oauth1: {
        consumerKey: '',
        consumerSecret: '',
        signatureMethod: '', // default HMAC-SHA1/ emum ['HMAC-SHA1', 'HMAC-SHA256', 'HMAC-SHA512', 'RSA-SHA1', 'RSA-SHA256', 'RSA-SHA512', 'PLAINTEXT']
        // 目前 APIpost 支持 ['HMAC-SHA1', 'HMAC-SHA256', 'HMAC-SHA512', 'PLAINTEXT']
        addEmptyParamsToSign: -1, // 对我们无效
        includeBodyHash: -1,
        addParamsToHeader: -1,
        realm: '',
        version: '1.0',
        nonce: '',
        timestamp: '',
        verifier: '',
        callback: '',
        tokenSecret: '',
        token: '',
    },
};

export const digestPlaceholder = {
    username: 'Username',
    password: 'Password',
    realm: 'testrealm@example.com',
    nonce: 'Nonce',
    algorithm: 'select',
    qop: 'e.g. auth-int',
    nc: 'e.g. 000000001',
    cnonce: 'e.g. 0a4f113b',
    opaque: 'Opaque',
};

export const digestAlgorithmOptions = [
    'MD5',
    'MD5-sess',
    'SHA-256',
    'SHA-256-sess',
    'SHA-512-256',
    'SHA-512-256-sess',
];

export const hawkPlaceholder = {
    authId: 'Auth Id',
    authKey: 'Auth Key',
    algorithm: 'select',
    user: 'Username',
    nonce: 'Nonce',
    extraData: 'e.g. some-app-extra-data',
    app: 'Application ID',
    delegation: 'e.g. delegated-by',
    timestamp: 'TimeStamp',
};

export const hawkAlgotithOptions = ['sha256', 'sha1'];

export const awsPlaceholder = {
    accessKey: 'Access Key',
    secretKey: 'Secret Key',
    region: 'e.g. us-east-1',
    service: 'e.g. s3',
    sessionToken: 'Session Token',
};

export const ntlmPlacrholder = {
    username: 'Username',
    password: 'password',
    domain: 'e.g. example.com',
    workstation: 'e.g. someone-PC',
};

export const edgegridPlaceholder = {
    accessToken: 'Access Token',
    clientToken: 'Client Token',
    clientSecret: 'Client Secret',
    nonce: 'Nonce',
    timestamp: 'Timestamp',
    baseURi: 'Base Url',
    headersToSign: 'Header To Sign',
};

export const OAuth1MethodsOptions = [
    'HMAC-SHA1',
    'HMAC-SHA256',
    'HMAC-SHA512',
    'RSA-SHA1',
    'RSA-SHA256',
    'RSA-SHA512',
    'PLAINTEXT',
];
