var express = require('express');
var wol = require('wake_on_lan');
var sshExec = require('ssh-exec');
var config = require('./config.js');

var app = express();

var machineApiRouter = express.Router()

machineApiRouter.get('/', function (req, res) {
    res.json(config.machines || []);
});

machineApiRouter.get('/:machineId/status', function (req, res) {
    let machine = config.machines[req.params.machineId];
    if (!machine) {
        res.sendStatus(500);
        return;
    }

    sshExec('nvidia-smi', {
        user: machine.user,
        host: machine.host,
        password: machine.password
    }, function (err, stdout, stderr) {
        if (err) {
            res.status(500).send(stderr);
        } else {
            res.send(stdout);
        }
    });
});

machineApiRouter.post('/:machineId/wake', function (req, res) {
    let machine = config.machines[req.params.machineId];
    if (!machine) {
        res.sendStatus(500);
        return;
    }

    wol.wake(machine.mac, function (error) {
        if (error) {
            res.status(500).send('Failure: ' + error);
        } else {
            res.send('OK');
        }
    })
});

app.use('/api/machines', machineApiRouter);
app.use(express.static('public'));

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'));
});