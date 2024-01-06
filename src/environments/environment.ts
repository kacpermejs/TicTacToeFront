export const environment = {
    production: true,
    apiUrl: "",
    apiWebsocket: '${HOST_WEBSOCKET}/websocket',
    requestTestEndpoint: '/game/save-word',
    topicTestEndpoint: '/topic/repeat',

    //session
    sessionJoinRequestEndpoint: '',
    gameFoundTopicEndpoint: '',
    //game

    cognito: {
        userPoolId: 'us-east-1_R73Wa0n55',
        userPoolWebClientId: '4bid09hhgh4pumicibq3mll6kc'
    }
}