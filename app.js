var express = require('express');
var apiMachinesRouter = require('./api/machines');

var app = express();

app.use('/api/machines', apiMachinesRouter);
app.use(express.static(__dirname + '/public'));
app.use('/dist/vue', express.static('node_modules/vue/dist'));

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'));
});