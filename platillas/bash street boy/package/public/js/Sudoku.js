app.controller('Sudoku', ['$scope', function ($scope) {
    $scope.sudoku = []
    $scope.testSudoku = function () {
        var sudokuSolver = new SudokuSolver($scope.sudoku)
        var solution = sudokuSolver.solve()
        if (solution) $scope.text = 'Puede resolverse'
        else $scope.text = 'NO puede resolverse'
    }
    $scope.testKey = function (row, col, value) {
        $scope.sudoku[row][col] = (!value || value === '') ? 0 : value
        $scope.testSudoku()
    }
    $scope.loadSudoku = function () {
        for (var i = 0; i < 9; i++) {
            if (!$scope.sudoku[i]) $scope.sudoku.push([])
            for (var j = 0; j < 9; j++) {
                if (Math.floor(Math.random() * 10) < 5)
                    $scope.sudoku[i][j] = Math.floor(Math.random() * 9) + 1
                else $scope.sudoku[i][j] = 0
            }
        }
        $scope.testSudoku()
    }
    $scope.loadSudoku()
}])