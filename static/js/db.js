const fs = require('fs');


const sBahn= JSON.parse(fs.readFileSync('../../routes/Lines_SBahn.geojson',"utf-8"));
console.log(sBahn)