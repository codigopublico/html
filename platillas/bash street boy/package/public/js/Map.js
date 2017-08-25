app.controller('Map', ['NgMap', '$scope', '$http', '$q', '$timeout', function (NgMap, $scope, $http, $q, $timeout) {
    var getLastLocation = function () {
        return $http.get('/api/lastlocation')
    },
        setPositions = function () {
            $q.resolve(getLastLocation())
                .then(function (response) {
                    if (response) {
                        response.data.shift()
                        $scope.positions = response.data
                        $timeout(setPositions, 90000)
                    }
                }, function (response) {
                    $scope.positions = []
                })
        }
    NgMap.getMap().then(function (map) {
        setPositions();
    })
}])