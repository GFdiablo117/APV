const express = require('express');
const app = express();
const path = require('path');
const mvgApi = require('@lynbarry/mvg-api');



// viewed at http://localhost:8080
app.use('/static', express.static('static'))
app.use('/routes', express.static('routes'))
app.use('/stations', express.static('stations'))
app.use('/tours', express.static('tours'))
app.use('/svg', express.static('svg'))
app.use('/png', express.static('png'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/departues/:station/:vehicle', async function (req, res) {
    let station = req.params.station;
    let options = [req.params.vehicle]
    try{
    const departues = await mvgApi.getDepartures(station, options)
    res.send(departues)
    }catch(err){
    } 
    res.send(null)
 });
app.listen(8080);