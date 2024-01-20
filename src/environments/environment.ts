export const environment = {
    production: true,
    apiUrl: 'http://tictactoe-env.eba-mn2mtuqg.us-east-1.elasticbeanstalk.com:8080', //process.env['API_HOST'],
    apiWebsocket: 'http://tictactoe-env.eba-mn2mtuqg.us-east-1.elasticbeanstalk.com:8080/websocket', //process.env['HOST_WEBSOCKET'] + '/websocket',

    cognito: {
        userPoolId: 'us-east-1_R73Wa0n55',
        userPoolWebClientId: '4bid09hhgh4pumicibq3mll6kc'
    }
}