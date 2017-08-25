app.controller('Ppt', ['$scope', function ($scope) {
    var empate = pierdes = ganas = 0
    var random = function (n) {
        return Math.floor(Math.random() * n + 1)
    }
    function fppt(jugada) {
        if (jugada === 1) return 'rock'
        else if (jugada === 2) return 'paper'
        else return 'scissors'
    }
    $scope.jugar = function (ppt) {
        var jugada = random(3)
        $scope.computer = fppt(jugada)
        if (jugada === ppt) {
            $scope.result = 'empate'
            empate++
        }
        else if ((ppt === 1 && jugada === 2) || (ppt === 2 && jugada === 3) || (ppt === 3 && jugada === 1)) {
            $scope.result = 'pierdes'
            pierdes++
        }
        else {
            $scope.result = 'ganas'
            ganas++
        }
        var total = ganas + empate + pierdes
        $scope.marcador = 'ganados: ' + ganas + ' (' + Math.round((ganas / total) * 100) +
            '%) empates: ' + empate + ' (' + Math.round((empate / total) * 100) +
            '%) perdidos: ' + pierdes + ' (' + Math.round((pierdes / total) * 100) + '%)'
    }
}])