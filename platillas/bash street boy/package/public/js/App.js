'use strict'
var app = angular
    .module('App', ['ngRoute', 'ngMap'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('.', {
                templateUrl: 'views/tictactoe.html',
                controller: 'TicTacToe'
            })
            .when('/peerjs', {
                templateUrl: 'views/peerjs.html',
                controller: 'PeerJS'
            })
            .when('/ppt', {
                templateUrl: 'views/ppt.html',
                controller: 'Ppt'
            })
            .when('/wave', {
                templateUrl: 'views/wave.html',
                controller: 'Wave'
            })
            .when('/sudoku', {
                templateUrl: 'views/sudoku.html',
                controller: 'Sudoku'
            })
            .when('/file', {
                templateUrl: 'views/file.html',
                controller: 'File'
            })
            .when('/xmpp', {
                templateUrl: 'views/xmpp.html',
                controller: 'Xmpp'
            })
            .when('/map', {
                templateUrl: './views/map.html',
                controller: 'Map'
            })
            .otherwise({
                redirectTo: '.'
            })
        if (window.history && window.history.pushState)
            $locationProvider.html5Mode(true).hashPrefix('!')
    }])
    .directive('meme', ['$timeout', '$http', '$q', '$window', function ($timeout, $http, $q, $window) {
        var text, getFortune = function () {
            return $http.get('./api/fortune')
        }
        function memeText(scope, element, attrs) {
            $q.resolve(getFortune()).then(function (response) {
                response.data.split(' ').map(function (data, index, text) {
                    $timeout(function () {
                        element.text(data)
                        if (index === text.length - 1)
                            memeText(scope, element, attrs)
                    }, (index + 1) * 500)
                })
                if ($window.speechSynthesis) {
                    var speech = new SpeechSynthesisUtterance(),
                        synth = $window.speechSynthesis
                    if (scope.voice && !synth.speaking) {
                        speech.text = response.data
                        speech.lang = 'es'
                        speech.voice = synth.getVoices()[63]
                        speech.pitch = 1
                        speech.rate = 1
                        synth.speak(speech)
                    }
                }
            }, function (response) {
                element.text('Error')
                memeText(scope, element, attrs)
            })
        }
        return {
            restrict: 'E',
            link: memeText
        }
    }])