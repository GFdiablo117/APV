
const config = require('./config.json');
const gtfsToGeoJSON = require('gtfs-to-geojson');


gtfsToGeoJSON(config)
.then(() => {
  console.log('GeoJSON Generation Successful');
})
.catch(err => {
  console.error(err);
});