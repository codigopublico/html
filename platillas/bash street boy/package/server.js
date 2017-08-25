// server.js

'use strict'

// Require Modules
const express = require('express'),
  app = express(),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  serveStatic = require('serve-static'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  secure = require('express-force-ssl'),
  helmet = require('helmet'),
  geoip = require('geoip-lite'),
  options = {
    key: fs.readFileSync(__dirname + '/ssl/key.pem'),
    cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
  },
  lastLocation = [{}]

// Express Middleware
morgan.token('body', (req, res) => {
  var geo = geoip.lookup(req.ip),
    exists = false
  if (geo) {
    lastLocation.map(function (data, index) {
      if (Date.now() - data.date > 3600000 * 6)
        lastLocation.splice(index, 1)
      else if (JSON.stringify(data.ll) === JSON.stringify(geo.ll))
        exists = true
      if (!exists && index === lastLocation.length - 1)
        lastLocation.push({ date: Date.now(), ll: geo.ll })
    })
  }
  return JSON.stringify(req.body)
})
app
  .use(compression({ level: 9 }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(secure)
  .use(helmet())
  .use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":body"', { stream: fs.createWriteStream(__dirname + '/logs/access.log', { flags: 'a' }) }))
  .use(serveStatic(__dirname + '/public', { maxAge: '1d' }))
  .get('/api/fortune', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8')
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    require('child_process').exec('/usr/games/fortune').stdout
      .on('data', (data) => {
        res.write(data.replace(/[\n\r\t\0]+/g, ' '))
      })
      .on('end', () => {
        res.end()
      })
  })
  .get('/api/lastlocation', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8')
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.end(JSON.stringify(lastLocation))
  })
  .use((req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })

// Servers
http.createServer(app).listen(80)
https.createServer(options, app).listen(443)
