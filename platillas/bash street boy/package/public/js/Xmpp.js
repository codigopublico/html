app.controller('Xmpp', ['$scope', function ($scope) {
    $scope.messages = []
    $scope.connected = true
    var client
    $scope.connect = function (username, password, muc) {
        var user = username.replace(/@.*/, '')
        if (client) client.disconnect()
        client = XMPP.createClient({
            jid: username,
            password: password,
            transport: 'websocket',
            wsURL: 'wss:bash-street-boys-and-girls.com:5281/xmpp-websocket'
        })
        client.on('session:started', function () {
            client.getRoster(function () {
                client.sendPresence()
            })
            client.joinRoom(muc, username.replace(/@.*/, ''), {
                status: 'My status on bash-street-boys-and-girls.com :)',
                joinMuc: {
                    password: '',
                    history: {
                        maxstanzas: 1
                    }
                }
            })
        })
        client.on('message', function (message) {
            if (message && message.from && message.from.resource !== user)
                $scope.messages.push(message.from.resource + ': ' + message.body)
        })
        client.on('connected', function () {
            $scope.connected = true
        })
        client.on('disconnected', function () {
            $scope.connected = false
        })
        $scope.sendMessage = function (message) {
            client.sendMessage({
                type: 'groupchat',
                from: muc + '/' + user,
                to: muc,
                body: message
            })
            $scope.messages.push(user + ': ' + message)
            $scope.message = ''
        }
        client.connect()
    }
}])