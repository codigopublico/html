app.controller('Wave', ['$scope', function ($scope) {
    $scope.icon = 'pause'
    $scope.button = 'Pause'
    var filename,
        fileBlob = [],
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#909090',
            progressColor: 'white',
            cursorColor: 'white'
        })
    $scope.playPause = function () {
        wavesurfer.playPause()
        if (wavesurfer.isPlaying()) {
            $scope.icon = 'play'
            $scope.button = 'Play'
        } else {
            $scope.icon = 'pause'
            $scope.button = 'Pause'
        }
    }
    wavesurfer.on('ready', function () {
        wavesurfer.play();
        $scope.icon = 'play'
        $scope.button = 'Play'
    })
    $scope.load = function (file) {
        $scope.spinner = true;
        filename = file.replace(/.*\//, '').replace(/.*=/, '')
        ytdl(file, { filter: 'audioonly' })
            .on('data', function (data) {
                fileBlob.push(data)
            })
            .on('end', function () {
                wavesurfer.loadBlob(new File(fileBlob, filename))
                $scope.spinner = false;
            })
    }
    $scope.downloadFile = function () {
        saveAs(new File(fileBlob, filename + '.m4a'))
    }
}])