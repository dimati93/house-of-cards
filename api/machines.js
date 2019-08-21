var express = require('express');
var wol = require('wake_on_lan');
var ping = require('ping');
var sshExec = require('ssh-exec');
var config = require('../config');

var router = express.Router()

router.get('/', function (req, res) {
    let machines = config.machines;
    if (!machines || !Array.isArray(machines)) {
        res.sendStatus(204);
        return;
    }

    let model = machines.map((m, i) => { 
        return { 
            id: i,
            host: m.host 
        } 
    });

    res.json(model);
});

router.get('/:machineId/status', function (req, res) {
    let machine = config.machines[req.params.machineId];
    if (!machine) {
        res.sendStatus(500);
        return;
    }

    ping.sys.probe(machine.host, function (isAlive) {
        if (!isAlive) {
            res.json({online: false});
            return;
        }

        sshExec('nvidia-smi', {
            user: machine.user,
            host: machine.host,
            password: machine.password
        }, function (err, stdout, stderr) {
            if (err) {
                res.status(500).json({ online: true, error: stderr });
                return;
            } 

            res.json({ online: true, nvidiaStats: stdout });            
        });
    });    
});

router.post('/:machineId/wake', function (req, res) {
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


module.exports = router;