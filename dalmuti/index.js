let path = require('path');
let express = require('express');

let app = express();

let staticPath = path.join(__dirname, '/phaser');
app.use(express.static(staticPath));

app.listen(3001, function() {
  console.log('listening');
});