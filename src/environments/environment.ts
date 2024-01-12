export const environment = {
    production: true,
    apiUrl: 'http://127.0.0.1:8080', //process.env['API_HOST'],
    apiWebsocket: 'http://127.0.0.1:8080/websocket', //process.env['HOST_WEBSOCKET'] + '/websocket',

    cognito: {
        userPoolId: 'us-east-1_R73Wa0n55',
        userPoolWebClientId: '4bid09hhgh4pumicibq3mll6kc'
    }
}