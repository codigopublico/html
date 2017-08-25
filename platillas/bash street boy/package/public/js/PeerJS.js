app.controller('PeerJS', ['$scope', '$window', function ($scope, $window) {
    var peer
    while (!$window.location.hash.substr(1) || $window.location.hash.substr(1) === 'null')
        $window.location.hash = prompt('Who are you?')
    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.msGetUserMedia)
    if (util.browser === 'Firefox') {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (s) {
            start(s)
        }).catch(function (err) {
            console.log('The following error occurred: ' + err.name)
        })
    }
    else {
        navigator.getMedia({ audio: true, video: true }, function (s) {
            start(s)
        }, function (err) {
            console.log('The following error occurred: ' + err.name)
        })
    }
    function start(s) {
        $window.ls = s
        peer = new Peer($window.location.hash.substr(1), {
            host: 'bash-street-boys-and-girls.com',
            port: 9000,
            path: '/',
            debug: 0,
            config: { 'iceServers': [{ url: 'stun:bash-street-boys-and-girls.com:3478' },
                { url: 'turns:bash-street-boys-and-girls@bash-street-boys-and-girls.com',
                    username: 'bash-street-boys-and-girls',
                    credential: 'bash-street-boys-and-girls'
                }]
            },
            secure: true
        })
        peer.on('error', function () {
            console.log('peer error')
        })
            .on('close', function () {
                console.log('peer closed')
            })
            .on('disconnected', function () {
                if (!peer.destroyed)
                    peer.reconnect()
            })
            .on('call', function (c) {
                c.answer(s)
                c.on('stream', function (s) {
                    $scope.nick = c.peer
                    angular.element(document.querySelector('#remotevideo')).attr({ src: URL.createObjectURL(s), autoplay: true })
                    angular.element(document.querySelector('#localvideo')).attr({ src: URL.createObjectURL(ls), autoplay: true, muted: true })
                })
                    .on('close', function () {
                        console.log('call closed')
                    })
                peer.on('connection', function (conn) {
                    conn.on('open', function () {
                        $scope.chatlist = []
                        conn.on('data', function (data) {
                            $scope.chatlist.push(data)
                        })
                            .on('error', function (err) {
                                console.log(err)
                            })
                        $scope.sendChat = function (text) {
                            $scope.chatlist.push(text)
                            conn.send(text)
                            $scope.chat = ''
                        }
                    })
                })
            })
    }
    $scope.call = function (name) {
        var mc = peer.call(name, $window.ls)
        mc.on('stream', function (s) {
            $scope.nick = name
            angular.element(document.querySelector('#localvideo')).attr({ src: URL.createObjectURL(ls), autoplay: true, muted: true })
            angular.element(document.querySelector('#remotevideo')).attr({ src: URL.createObjectURL(s), autoplay: true })
        })
            .on('close', function () {
                console.log('my call closed')
            })
        var conn = peer.connect(name)
        conn.on('open', function () {
            $scope.chatlist = []
            conn.on('data', function (data) {
                $scope.chatlist.push(data)
            })
                .on('error', function (err) {
                    console.log(err)
                })
            $scope.sendChat = function (text) {
                $scope.chatlist.push(text)
                conn.send(text)
                $scope.chat = ''
            }
        })
    }
}])
