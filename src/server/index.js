const { resolve } = require('path')
const history = require('connect-history-api-fallback')
var express = require('express');
var configureApi = require('./api')

var app = express();

configureApi(app);
app.use(express.static(resolve(__dirname, '../../dist')));
app.use('/dist/vue', express.static('node_modules/vue/dist'));
app.use('/', history())

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'));
});