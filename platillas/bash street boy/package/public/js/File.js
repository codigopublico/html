app.controller('File', ['$scope', '$window', function ($scope, $window) {
    var trackers = [
        'wss://bash-street-boys-and-girls.com:8000',
        'udp://bash-street-boys-and-girls.com:8000',
        'https://bash-street-boys-and-girls.com:8000/announce'
    ],
        holder = angular.element(document.querySelector('.holder'))
    $scope.urls = []
    if (!$window.FileReader) {
        $scope.status = 'WebTorrent NOT Ready'
    } else {
        $scope.status = 'WebTorrent Ready'
        $scope.holder = 'Drag&Drop files here to share'
        if ($window.location.hash.substr(1)) {
            var client = new WebTorrent(),
                torrent = client.add({
                    infoHash: $window.location.hash.substr(1),
                    announce: trackers
                })
            torrentEvents(torrent, false)
        }
    }
    holder.on('drop', function (event) {
        event.preventDefault()
        event.stopPropagation()
        holder.removeClass('white-border')
        if (event.dataTransfer.files) {
            var files = event.dataTransfer.files
            if (files.length > 1) {
                var names = []
                for (var i = 0; i < files.length; i++) {
                    names.push(files[i].name)
                }
                $scope.title = names.join(', ')
                seed(files)
            }
            else {
                var file = files[0]
                $scope.title = file.name
                seed(file)
            }
        }
    })
        .on('dragover', function (event) {
            event.preventDefault()
            event.stopPropagation()
            holder.addClass('white-border')
            return false
        })
        .on('dragleave', function (event) {
            event.preventDefault()
            event.stopPropagation()
            holder.removeClass('white-border')
            return false
        })
    function seed(file) {
        var client = new WebTorrent(),
            torrent = client.seed(file, {
                announce: trackers
            })
        torrentEvents(torrent, true)
    }
    function torrentEvents(torrent, seeding) {
        torrent.on('metadata', function () {
            $scope.title = torrent.name
            $scope.hash = torrent.infoHash
            $scope.size = Math.round((torrent.length / 1024 / 1024) * 100) / 100
        })
        torrent.on('ready', function () {
            torrent.files.map(function (file) {
                file.appendTo('.holder', function (err) {
                    if (err) $scope.status = err
                    else $scope.status = 'Content loaded'
                })
            })
        })
        torrent.on('download', function (bytes) {
            $scope.status = 'Downloading'
            updateTorrent(torrent)
            $scope.progress = Math.round(torrent.progress * 10000) / 100 || 0
        })
        torrent.on('wire', function (wire) {
            $scope.peers = torrent.numPeers || 0
        })
        torrent.on('done', function () {
            $scope.status = 'Downloaded'
            updateTorrent(torrent)
            if (!seeding) {
                torrent.files.map(function (data) {
                    var file = [], stream = data.createReadStream()
                    stream.on('data', function (data) {
                        file.push(data)
                    })
                        .on('end', function () {
                            saveAs(new File(file, data.name))
                        })
                })
            }
        })
        torrent.on('upload', function (data) {
            $scope.status = 'Uploading'
            updateTorrent(torrent)
        })
        torrent.on('noPeers', function () {
            $scope.status = 'No Peers'
            updateTorrent(torrent)
        })
    }
    function updateTorrent(torrent) {
        $scope.downloading = Math.round(torrent.downloadSpeed / 10) / 100 || 0
        $scope.downloaded = Math.round((torrent.downloaded / 1024 / 1024) * 100) / 100
        $scope.uploading = Math.round(torrent.uploadSpeed / 10) / 100 || 0
        $scope.uploaded = Math.round((torrent.uploaded / 1024 / 1024) * 100) / 100
        $scope.peers = torrent.numPeers || 0
    }
}])