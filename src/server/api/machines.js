var express = require('express');
var wol = require('wake_on_lan');
var ping = require('ping');
var nodeSsh = require('node-ssh');
var config = require('../config');
var map = require('./map');
var xmlConvert = require('xml-js');

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
            name: m.name
        } 
    });

    res.json(model);
});

router.get('/:machineId/gpu', function (req, res) {
    let machine = config.machines[req.params.machineId];
    if (!machine) {
        res.sendStatus(500);
        return;
    }

    ping.sys.probe(machine.host, function (isAlive) {
        if (!isAlive) {
            res.json({online: 'offline'});
            return;
        }

        ssh = new nodeSsh()

        ssh.connect({
            host: machine.host,
            username: machine.user,
            password: machine.password
        }).then(function () {
            ssh.execCommand('nvidia-smi -q -x')
                .then(function(result) {
                    var xml = result.stdout;
                    let js = xmlConvert.xml2js(xml, { compact: true });
                    return map.toGpuStatus(js.nvidia_smi_log);
                })
                .then(function (nvidiaStats) { 
                    ssh.dispose();
                    var status = { online: 'online', nvidiaStats: nvidiaStats };
                    res.json(status); 
                });
        });
    });    
});

router.get('/:machineId/users', function (req, res) {
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

        ssh = new nodeSsh()

        ssh.connect({
            host: machine.host,
            username: machine.user,
            password: machine.password
        }).then(function () {
            var status = { online: true };

            var gpuStatus = ssh.execCommand('nvidia-smi -q -x')
                .then(function(result) {
                    var xml = result.stdout;
                    let js = xmlConvert.xml2js(xml, { compact: true });
                    status.nvidiaStats = js.nvidia_smi_log;
                })

            var userStatus = ssh.execCommand('who')
                .then(function(result) {
                    status.users = result.stdout;
                })

            Promise.all([gpuStatus, userStatus]).then(function () {
                res.json(status);
            });
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