const express = require('express');
const app = express();
const path = require('path');

// viewed at http://localhost:8080
app.use('/static', express.static('static'))
app.use('/routes', express.static('routes'))
app.use('/stations', express.static('stations'))
app.use('/tours', express.static('tours'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);