app.controller('TicTacToe', ['$scope', '$window', function ($scope, $window) {
    var board = new TicTacToe.TicTacToeBoard(['', '', '', '', '', '', '', '', '']),
        aiPlayer = new TicTacToe.TicTacToeAIPlayer()
    var aiTeam = board.oppositePlayer('X')
    aiPlayer.initialize(aiTeam, board)
    var play = function () {
        var move = aiPlayer.makeMove()
        if (move != null) {
            board.makeMove(aiTeam, move)
        }
    }
    var test = function (p) {
        var array = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        array.map(function (data) {
            if (board.board[data[0]] === board.board[data[1]]
                && board.board[data[0]] === board.board[data[2]]
                && board.board[data[1]] === board.board[data[2]]
                && board.board[data[0]] !== '') {
                if (p === 'X') $scope.result = 'You Win!!'
                else $scope.result = 'You Lose :('
            }
        })
        if (board.board.indexOf('') === -1)
            $scope.result = 'Dead Heat'
    }
    $scope.push = function (p) {
        if (board.board[p] === '') {
            board.board[p] = 'X'
            test('X')
            play()
            test('O')
        }
    }
    $scope.board = board.board
    $scope.restart = function () {
        $window.location.reload(false)
    }
}])